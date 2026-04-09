import {
  IsDateString, IsEnum, IsNotEmpty, IsString, IsUUID, Matches,
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
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @IsNotEmpty()
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

  @ApiProperty()
  @IsUUID()
  branchId: string;
}
