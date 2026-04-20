import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import * as Sentry from "@sentry/node";
import { AppModule } from "./app.module";

async function bootstrap() {
  const integrations: any[] = [];

  try {
    const profiling = require("@sentry/profiling-node") as {
      nodeProfilingIntegration: () => unknown;
    };
    integrations.push(profiling.nodeProfilingIntegration());
  } catch {
    console.warn(
      "Sentry profiling desabilitado: binario nativo nao compativel com a versao atual do Node.",
    );
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN || "",
    integrations,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  const config = app.get(ConfigService);

  // Segurança
  app.use(helmet());
  const rawOrigins = config.get<string>("CORS_ORIGINS", "*");
  const origins: string | string[] | boolean =
    rawOrigins === "*" ? true : rawOrigins.split(",").map((o) => o.trim());

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  // Prefixo global
  app.setGlobalPrefix("api/v1");

  // Validação automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle("TransRota API")
    .setDescription("SaaS de Gestão de Frota e Rotas")
    .setVersion("1.0")
    .addBearerAuth()
    .addApiKey(
      { type: "apiKey", name: "X-Tenant-ID", in: "header" },
      "X-Tenant-ID",
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  const port = config.get<number>("PORT", 3001);
  await app.listen(port);
  console.log(`TransRota API running on port ${port}`);
}

bootstrap();
