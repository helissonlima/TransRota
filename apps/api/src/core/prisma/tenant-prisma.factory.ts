import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { TenantPrismaService } from './tenant-prisma.service';

@Injectable()
export class TenantPrismaFactory implements OnModuleDestroy {
  private readonly clients = new Map<string, TenantPrismaService>();

  async getClient(schemaName: string): Promise<TenantPrismaService> {
    if (!this.clients.has(schemaName)) {
      const client = new TenantPrismaService(schemaName);
      await client.connect();
      this.clients.set(schemaName, client);
    }
    return this.clients.get(schemaName)!;
  }

  async onModuleDestroy() {
    for (const client of this.clients.values()) {
      await client.disconnect();
    }
    this.clients.clear();
  }
}
