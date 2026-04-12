import { IsString, IsNumber, IsOptional, IsEnum, Min, Max, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum CommissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export class CreateCommissionDto {
  @ApiProperty({ description: 'ID do motorista' })
  @IsString()
  driverId: string;

  @ApiProperty({ description: 'Período no formato YYYY-MM (ex: 2025-04)' })
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Período deve estar no formato YYYY-MM' })
  period: string;

  @ApiProperty({ description: 'Número de rotas/viagens no período' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  routeCount: number;

  @ApiProperty({ description: 'Valor base de cálculo (ex: receita bruta das rotas)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  baseAmount: number;

  @ApiProperty({ description: 'Percentual de comissão (0-100)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiPropertyOptional({ description: 'Bônus adicional' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bonus?: number;

  @ApiPropertyOptional({ description: 'Deduções/descontos' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deductions?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCommissionStatusDto {
  @ApiProperty({ enum: CommissionStatus })
  @IsEnum(CommissionStatus)
  status: CommissionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCommissionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  routeCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  baseAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bonus?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deductions?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
