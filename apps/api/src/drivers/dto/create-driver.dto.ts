import {
  IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LicenseCategory, DriverStatus } from '@transrota/shared';

export class CreateDriverDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123.456.789-09' })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido' })
  cpf: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, { message: 'Telefone inválido' })
  phone: string;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @Length(11, 11, { message: 'CNH deve ter exatamente 11 dígitos' })
  @Matches(/^\d{11}$/, { message: 'CNH deve conter apenas dígitos' })
  licenseNumber: string;

  @ApiProperty({ enum: LicenseCategory })
  @IsEnum(LicenseCategory)
  licenseCategory: LicenseCategory;

  @ApiProperty({ example: '2026-03-15' })
  @IsDateString()
  licenseExpiry: string;

  @ApiProperty({ enum: DriverStatus, required: false })
  @IsEnum(DriverStatus)
  status: DriverStatus = DriverStatus.ACTIVE;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  branchId?: string;

  // --- New optional fields ---

  @ApiProperty({ required: false, example: '1990-05-20' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ required: false, example: '12.345.678-9' })
  @IsOptional()
  @IsString()
  rg?: string;

  @ApiProperty({ required: false, example: 'SSP' })
  @IsOptional()
  @IsString()
  rgIssuingOrg?: string;

  @ApiProperty({ required: false, example: 'SP' })
  @IsOptional()
  @IsString()
  rgIssuingState?: string;

  @ApiProperty({ required: false, example: 'Brasileira' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  filiation?: string;

  @ApiProperty({ required: false, example: '2005-01-10' })
  @IsOptional()
  @IsDateString()
  licenseFirstDate?: string;

  @ApiProperty({ required: false, example: '2022-01-10' })
  @IsOptional()
  @IsDateString()
  licenseIssueDate?: string;

  @ApiProperty({ required: false, example: 'DETRAN' })
  @IsOptional()
  @IsString()
  licenseIssuingOrg?: string;

  @ApiProperty({ required: false, example: 'SP' })
  @IsOptional()
  @IsString()
  licenseIssuingState?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  licenseRegistrationNumber?: string;
}
