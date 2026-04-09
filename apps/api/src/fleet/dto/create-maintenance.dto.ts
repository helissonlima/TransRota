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

  @ApiProperty({ example: 450.00 })
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty({ example: 47500 })
  @IsNumber()
  @Min(0)
  km: number;

  @ApiProperty()
  @IsDateString()
  performedAt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  nextDueKm?: number;

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
}
