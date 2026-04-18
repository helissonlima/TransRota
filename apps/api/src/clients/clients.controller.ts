import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@transrota/shared";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { TenantPrismaService } from "../core/prisma/tenant-prisma.service";
import { TenantPrisma } from "../tenant/tenant.decorator";
import { ClientsService } from "./clients.service";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto";

@ApiTags("Clientes")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: "Listar clientes" })
  list(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query("includeInactive") includeInactive?: string,
    @Query("q") q?: string,
    @Query("limit") limit?: string,
  ) {
    return this.clientsService.list(
      prisma,
      includeInactive === "true",
      q,
      limit ? Number(limit) : undefined,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Detalhar cliente" })
  findOne(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param("id") id: string,
  ) {
    return this.clientsService.findOne(prisma, id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Criar cliente" })
  create(
    @TenantPrisma() prisma: TenantPrismaService,
    @Body() dto: CreateClientDto,
  ) {
    return this.clientsService.create(prisma, dto);
  }

  @Put(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Atualizar cliente" })
  update(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param("id") id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.update(prisma, id, dto);
  }
}
