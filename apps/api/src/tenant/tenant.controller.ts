import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@ApiTags('Companies')
@Controller('companies')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova empresa (onboarding)' })
  async create(@Body() dto: CreateCompanyDto) {
    return this.tenantService.createCompany(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas (admin master)' })
  async list() {
    return this.tenantService.listCompanies();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar empresa por ID' })
  async findOne(@Param('id') id: string) {
    return this.tenantService.getCompany(id);
  }
}
