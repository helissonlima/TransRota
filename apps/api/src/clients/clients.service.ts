import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { TenantPrismaService } from "../core/prisma/tenant-prisma.service";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto";

@Injectable()
export class ClientsService {
  async list(
    prisma: TenantPrismaService,
    includeInactive = false,
    q?: string,
    limit = 30,
  ) {
    return prisma.client.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { doc: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { _count: { select: { saleOrders: true } } },
      orderBy: { name: "asc" },
      take: Math.max(1, Math.min(limit, 100)),
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        saleOrders: {
          take: 20,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            number: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
        _count: { select: { saleOrders: true } },
      },
    });
    if (!client) throw new NotFoundException("Cliente não encontrado");
    return client;
  }

  async create(prisma: TenantPrismaService, dto: CreateClientDto) {
    const existingByDoc = dto.doc
      ? await prisma.client.findFirst({ where: { doc: dto.doc } })
      : null;

    if (existingByDoc) {
      throw new ConflictException("Já existe cliente com este documento");
    }

    return prisma.client.create({ data: dto });
  }

  async update(prisma: TenantPrismaService, id: string, dto: UpdateClientDto) {
    await this.findOne(prisma, id);

    if (dto.doc) {
      const existingByDoc = await prisma.client.findFirst({
        where: { doc: dto.doc, id: { not: id } },
      });
      if (existingByDoc)
        throw new ConflictException("Já existe cliente com este documento");
    }

    return prisma.client.update({ where: { id }, data: dto });
  }
}
