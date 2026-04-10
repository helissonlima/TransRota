import {
  IsDateString, IsNumber, IsOptional, IsString, Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsageLogDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ required: false, example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialKm?: number;

  @ApiProperty({ required: false, example: 150 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  finalKm?: number;

  @ApiProperty({ required: false, example: 150 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalKm?: number;

  @ApiProperty({ required: false, example: 50.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalCost?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
