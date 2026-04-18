import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { MasterPrismaService } from "../core/prisma/master-prisma.service";
import { TenantRequest } from "../tenant/tenant.middleware";
import { StorageService } from "./storage.service";

@Controller()
export class StorageController {
  constructor(
    private readonly storageService: StorageService,
    private readonly masterPrisma: MasterPrismaService,
  ) {}

  @Post("upload/photo")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 4 * 1024 * 1024,
      },
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: TenantRequest,
    @Query("entity") entity?: string,
  ) {
    if (!file) {
      throw new BadRequestException("Arquivo não enviado");
    }

    if (!file.mimetype?.startsWith("image/")) {
      throw new BadRequestException("Somente imagens são permitidas");
    }

    const result = await this.storageService.optimizeAndUploadPhoto({
      fileBuffer: file.buffer,
      tenantId: req.tenantId,
      entity: entity ?? "generic",
      fileName: file.originalname,
    });

    const photoUrl = `/api/v1/media/photo?tenantId=${encodeURIComponent(req.tenantId)}&key=${encodeURIComponent(result.key)}`;

    return {
      ...result,
      photoUrl,
    };
  }

  @Get("media/photo")
  async getPhoto(
    @Query("key") key: string,
    @Query("tenantId") tenantId: string,
    @Res() res: Response,
  ) {
    if (!key || !tenantId) {
      throw new BadRequestException(
        "Parâmetros key e tenantId são obrigatórios",
      );
    }

    const company = await this.masterPrisma.company.findFirst({
      where: { id: tenantId, isActive: true },
      select: { id: true },
    });

    if (!company) {
      throw new ForbiddenException("Tenant inválido");
    }

    if (!key.startsWith(`tenants/${tenantId}/`)) {
      throw new ForbiddenException("Arquivo não pertence ao tenant informado");
    }

    const { buffer, contentType } = await this.storageService.getObject({
      key,
    });

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(buffer);
  }
}
