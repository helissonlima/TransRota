import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { CreateDriverDocumentDto } from './dto/create-driver-document.dto';

@Injectable()
export class DriversService {
  async create(prisma: TenantPrismaService, dto: CreateDriverDto) {
    const existing = await prisma.driver.findFirst({
      where: { OR: [{ cpf: dto.cpf }, { licenseNumber: dto.licenseNumber }] },
    });
    if (existing) throw new ConflictException('CPF ou CNH já cadastrado');

    return prisma.driver.create({ data: dto });
  }

  async findAll(prisma: TenantPrismaService, branchId?: string) {
    return prisma.driver.findMany({
      where: { isActive: true, ...(branchId ? { branchId } : {}) },
      include: { branch: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        branch: { select: { name: true } },
        documents: { orderBy: { createdAt: 'desc' } },
        _count: { select: { routes: true } },
      },
    });
    if (!driver) throw new NotFoundException('Motorista não encontrado');
    return driver;
  }

  async update(prisma: TenantPrismaService, id: string, dto: UpdateDriverDto) {
    await this.findOne(prisma, id);
    return prisma.driver.update({ where: { id }, data: dto });
  }

  async deactivate(prisma: TenantPrismaService, id: string) {
    await this.findOne(prisma, id);
    await prisma.driver.update({ where: { id }, data: { isActive: false } });
  }

  async addDocument(prisma: TenantPrismaService, driverId: string, dto: CreateDriverDocumentDto) {
    await this.findOne(prisma, driverId);
    return prisma.driverDocument.create({ data: { driverId, ...dto } });
  }

  async getExpiringDocuments(prisma: TenantPrismaService, days = 30) {
    const deadline = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return prisma.driverDocument.findMany({
      where: { expiresAt: { lte: deadline } },
      include: { driver: { select: { name: true, phone: true } } },
      orderBy: { expiresAt: 'asc' },
    });
  }

  async getExpiringLicenses(prisma: TenantPrismaService, days = 60) {
    const deadline = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return prisma.driver.findMany({
      where: { isActive: true, licenseExpiry: { lte: deadline } },
      select: { id: true, name: true, phone: true, licenseNumber: true, licenseExpiry: true, licenseCategory: true },
      orderBy: { licenseExpiry: 'asc' },
    });
  }
}
