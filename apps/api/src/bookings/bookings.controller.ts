import {
  Body, Controller, Delete, Get, Param,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { TokenPayload, UserRole } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { PartialType } from '@nestjs/swagger';

class UpdateBookingDto extends PartialType(CreateBookingDto) {}

@ApiTags('Reservas de Veículos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Criar reserva de veículo' })
  create(
    @TenantPrisma() prisma: TenantPrismaService,
    @CurrentUser() user: TokenPayload,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(prisma, {
      ...dto,
      userId: dto.userId ?? user.sub,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar reservas' })
  @ApiQuery({ name: 'vehicleId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  findAll(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('vehicleId') vehicleId?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.bookingsService.findAll(prisma, vehicleId, userId, status, dateFrom, dateTo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da reserva' })
  findOne(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
  ) {
    return this.bookingsService.findOne(prisma, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar reserva' })
  update(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(prisma, id, dto);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Confirmar reserva' })
  confirm(
    @TenantPrisma() prisma: TenantPrismaService,
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
  ) {
    return this.bookingsService.confirm(prisma, id, user.sub);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Cancelar reserva' })
  cancel(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
  ) {
    return this.bookingsService.cancel(prisma, id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover reserva' })
  async remove(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
  ) {
    await this.bookingsService.remove(prisma, id);
    return { message: 'Reserva removida' };
  }
}
