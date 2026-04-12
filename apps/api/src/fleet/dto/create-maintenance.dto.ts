import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaintenanceDto {
  @ApiProperty({ example: 'preventiva' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Troca de óleo e filtros' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 450.00, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiProperty({ example: 47500, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  km?: number;

  @ApiProperty({ example: 1200, required: false, description: 'Horas trabalhadas (para máquinas pesadas)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  workedHours?: number;

  @ApiProperty()
  @IsDateString()
  performedAt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  nextDueKm?: number;

  @ApiProperty({ required: false, example: 1500, description: 'Próxima manutenção por hora (para máquinas pesadas)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  nextDueHours?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  nextDueDate?: string;

  @ApiProperty({ example: 'Auto Center Silva' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  // --- New optional fields ---

  @ApiProperty({ required: false, example: 200.00, description: 'Custo das peças' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  partsCost?: number;

  @ApiProperty({ required: false, example: 150.00, description: 'Custo de mão de obra' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  laborCost?: number;

  @ApiProperty({ required: false, example: 'NF-001234' })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiProperty({ required: false, example: 'Oficina Central Ltda' })
  @IsOptional()
  @IsString()
  workshopName?: string;
}
