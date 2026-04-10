import {
  IsBoolean, IsDateString, IsEnum, IsNotEmpty,
  IsNumber, IsOptional, IsString, IsUUID, Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FuelType } from '@transrota/shared';

export class CreateFuelRecordDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiProperty({ example: 45.5 })
  @IsNumber()
  @Min(0.1)
  liters: number;

  @ApiProperty({ example: 5.89 })
  @IsNumber()
  @Min(0)
  pricePerLiter: number;

  @ApiProperty({ example: 48200 })
  @IsNumber()
  @Min(0)
  km: number;

  @ApiProperty({ enum: FuelType })
  @IsEnum(FuelType)
  fuelType: FuelType;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isFullTank?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  station?: string;

  @ApiProperty()
  @IsDateString()
  performedAt: string;

  @ApiProperty({ required: false, example: 'NF-005678' })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;
}
