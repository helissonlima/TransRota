import { PrismaClient } from "../../../generated/tenant";

// Uma instância por tenant, gerenciada pelo TenantPrismaFactory
export class TenantPrismaService extends PrismaClient {
  constructor(schemaName: string) {
    const baseUrl = resolveTenantDatabaseBaseUrl();
    // Define o search_path para o schema do tenant
    const url = `${baseUrl}?schema=${schemaName}`;
    super({ datasources: { db: { url } } });
  }

  async connect() {
    await this.$connect();
  }

  async disconnect() {
    await this.$disconnect();
  }
}

function resolveTenantDatabaseBaseUrl() {
  const masterUrl = process.env.DATABASE_MASTER_URL;
  if (masterUrl) {
    return masterUrl.split("?")[0];
  }

  const baseUrl = process.env.DATABASE_BASE_URL;
  if (baseUrl) {
    return baseUrl;
  }

  throw new Error("DATABASE_MASTER_URL ou DATABASE_BASE_URL não configurada");
}
