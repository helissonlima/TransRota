import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBillingCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;
}

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  planId: string;

  @ApiProperty({ enum: ['BOLETO', 'CREDIT_CARD', 'PIX'] })
  @IsEnum(['BOLETO', 'CREDIT_CARD', 'PIX'])
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX';

  @ApiProperty({ enum: ['MONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'YEARLY'] })
  @IsEnum(['MONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'YEARLY'])
  cycle: 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';

  @ApiProperty()
  @IsDateString()
  nextDueDate: string;
}

export class CreateInvoiceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyId: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty({ enum: ['BOLETO', 'CREDIT_CARD', 'PIX'] })
  @IsEnum(['BOLETO', 'CREDIT_CARD', 'PIX'])
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX';

  @ApiProperty()
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
