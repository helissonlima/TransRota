import { IsString, IsNotEmpty, IsEnum, IsInt, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'] })
  @IsEnum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE'])
  type: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  maxVehicles: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  maxDrivers: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  maxUsers: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  maxBranches: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  storageGb: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  priceMonthly: number;
}

export class UpdatePlanDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  maxVehicles?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  maxDrivers?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsers?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  maxBranches?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  storageGb?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMonthly?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
