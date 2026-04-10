import {
  IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OilChangeStatus } from '@transrota/shared';

export class CreateOilChangeDto {
  @ApiProperty({ required: false, example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  changeDate?: string;

  @ApiProperty({ required: false, example: 50000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  changeKm?: number;

  @ApiProperty({ required: false, example: 52000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentKm?: number;

  @ApiProperty({ required: false, example: 60000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  nextChangeKm?: number;

  @ApiProperty({ enum: OilChangeStatus, required: false, default: OilChangeStatus.UP_TO_DATE })
  @IsOptional()
  @IsEnum(OilChangeStatus)
  status?: OilChangeStatus;

  @ApiProperty({ required: false, example: 2000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  kmDriven?: number;

  @ApiProperty({ required: false, example: '5W-30 Sintético' })
  @IsOptional()
  @IsString()
  oilType?: string;

  @ApiProperty({ required: false, example: 'João Mecânico' })
  @IsOptional()
  @IsString()
  responsibleName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
