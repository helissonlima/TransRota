import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export enum PaymentProviderDto {
  ASAAS = 'ASAAS',
  SICOOB = 'SICOOB',
  NONE = 'NONE',
}

export enum PaymentEnvironmentDto {
  SANDBOX = 'SANDBOX',
  PRODUCTION = 'PRODUCTION',
}

export class UpdatePaymentSettingsDto {
  @ApiProperty({ enum: PaymentProviderDto })
  @IsEnum(PaymentProviderDto)
  provider: PaymentProviderDto;

  @ApiProperty({ enum: PaymentEnvironmentDto })
  @IsEnum(PaymentEnvironmentDto)
  environment: PaymentEnvironmentDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  asaasApiKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  asaasWalletId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  asaasWebhookToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sicoobClientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sicoobClientSecret?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sicoobCertificateBase64?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sicoobPixKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
