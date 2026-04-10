import {
  IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty({ required: false, example: 'EQ-001' })
  @IsOptional()
  @IsString()
  tag?: string;

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
