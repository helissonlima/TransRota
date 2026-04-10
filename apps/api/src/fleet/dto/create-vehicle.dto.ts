import {
  IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional,
  IsString, IsUUID, Matches, Max, Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleType, FuelType } from '@transrota/shared';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  @Matches(/^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/, { message: 'Placa inválida' })
  plate: string;

  @ApiProperty({ example: 'Sprinter' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 'Mercedes-Benz' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 2022 })
  @IsInt()
  @Min(1990)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty({ enum: VehicleType })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ enum: FuelType })
  @IsEnum(FuelType)
  fuelType: FuelType;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @Min(0)
  currentKm: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  nextMaintenanceKm?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  nextMaintenanceDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  branchId?: string;
}
