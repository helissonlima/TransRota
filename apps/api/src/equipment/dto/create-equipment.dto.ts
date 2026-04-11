import {
  IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEquipmentDto {
  @ApiProperty({ required: false, example: 'EQ-001' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  tag?: number;

  @ApiProperty({ example: 'Escâner de Código de Barras' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'scanner' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ required: false, example: 'SN-123456' })
  @IsOptional()
  @IsString()
  identifier?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  branchId?: string;
}
