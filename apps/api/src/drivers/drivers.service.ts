import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { CreateDriverDocumentDto } from './dto/create-driver-document.dto';

@Injectable()
export class DriversService {
  private normalizeCpf(cpf: string) {
    return (cpf || '').replace(/\D/g, '');
  }

  private normalizeLicense(licenseNumber: string) {
    return (licenseNumber || '').replace(/\D/g, '');
  }

  private normalizeName(name: string) {
    return (name || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  async create(prisma: TenantPrismaService, dto: CreateDriverDto) {
    const normalizedCpf = this.normalizeCpf(dto.cpf);
    const normalizedLicense = this.normalizeLicense(dto.licenseNumber);
    const normalizedName = this.normalizeName(dto.name);

    const existing = await prisma.driver.findMany({
      where: { isActive: true },
      select: { id: true, cpf: true, licenseNumber: true, name: true },
    });

    const hasDuplicate = existing.some((driver) =>
      this.normalizeCpf(driver.cpf) === normalizedCpf ||
      this.normalizeLicense(driver.licenseNumber) === normalizedLicense ||
      this.normalizeName(driver.name) === normalizedName,
    );

    if (hasDuplicate) {
      throw new ConflictException('Motorista já cadastrado com mesmo nome, CPF ou CNH');
    }

    const { branchId, ...rest } = dto;

    // Se branchId não foi fornecido, usa a primeira branch disponível do tenant
    let resolvedBranchId = branchId;
    if (!resolvedBranchId) {
      const defaultBranch = await (prisma as any).branch.findFirst();
      if (!defaultBranch) throw new ConflictException('Nenhuma filial cadastrada para este tenant');
      resolvedBranchId = defaultBranch.id;
    }

    return prisma.driver.create({
      data: {
        ...rest,
        cpf: dto.cpf,
        licenseNumber: dto.licenseNumber,
        licenseExpiry: new Date(rest.licenseExpiry),
        branchId: resolvedBranchId,
      } as any,
    });
  }

  async findAll(prisma: TenantPrismaService, branchId?: string, status?: string) {
    return prisma.driver.findMany({
      where: {
        isActive: true,
        ...(branchId ? { branchId } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: {
        branch: { select: { id: true, name: true } },
        _count: { select: { routes: true } },
      },
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
    const current = await this.findOne(prisma, id);

    const nextName = dto.name ?? current.name;
    const nextCpf = dto.cpf ?? current.cpf;
    const nextLicense = dto.licenseNumber ?? current.licenseNumber;

    const normalizedCpf = this.normalizeCpf(nextCpf);
    const normalizedLicense = this.normalizeLicense(nextLicense);
    const normalizedName = this.normalizeName(nextName);

    const others = await prisma.driver.findMany({
      where: { isActive: true, id: { not: id } },
      select: { id: true, cpf: true, licenseNumber: true, name: true },
    });

    const hasDuplicate = others.some((driver) =>
      this.normalizeCpf(driver.cpf) === normalizedCpf ||
      this.normalizeLicense(driver.licenseNumber) === normalizedLicense ||
      this.normalizeName(driver.name) === normalizedName,
    );

    if (hasDuplicate) {
      throw new ConflictException('Já existe outro motorista com mesmo nome, CPF ou CNH');
    }

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
