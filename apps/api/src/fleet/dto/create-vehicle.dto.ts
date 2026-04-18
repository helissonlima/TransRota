import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
  IsBoolean,
  ValidateIf,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VehicleType, FuelType } from "@transrota/shared";

export class CreateVehicleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({ example: "ABC-1234", required: false })
  @ValidateIf((o) => !o.withoutPlate)
  @IsString()
  @Matches(/^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/, {
    message: "Placa inválida",
  })
  plate?: string;

  @ApiProperty({
    required: false,
    default: false,
    description:
      "Quando true, o sistema gera identificador interno para máquina sem placa",
  })
  @IsOptional()
  @IsBoolean()
  withoutPlate?: boolean;

  @ApiProperty({ example: "Sprinter" })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: "Mercedes-Benz" })
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

  // --- New optional fields ---

  @ApiProperty({ required: false, example: "TAG-001" })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiProperty({ required: false, example: "12345678901" })
  @IsOptional()
  @IsString()
  renavam?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  crvNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  chassisNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  securityCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  engineCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  documentExpiry?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  responsiblePerson?: string;

  @ApiProperty({ required: false, example: 80 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tankCapacity?: number;

  @ApiProperty({ required: false, example: 150 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  horsepower?: number;

  @ApiProperty({ required: false, example: 3500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  grossWeight?: number;

  @ApiProperty({ required: false, example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  axles?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cmt?: number;

  @ApiProperty({ required: false, example: 15 })
  @IsOptional()
  @IsInt()
  @Min(0)
  seats?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, example: 10000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  oilChangeIntervalKm?: number;

  @ApiProperty({ required: false, example: 2022 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  manufacturingYear?: number;
}
