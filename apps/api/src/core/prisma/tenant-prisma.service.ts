import { PrismaClient } from '../../../generated/tenant';

// Uma instância por tenant, gerenciada pelo TenantPrismaFactory
export class TenantPrismaService extends PrismaClient {
  constructor(schemaName: string) {
    const baseUrl = process.env.DATABASE_BASE_URL!;
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
