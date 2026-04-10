import {
  IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaxType, PaymentStatus } from '@transrota/shared';

export class CreateVehicleTaxDto {
  @ApiProperty()
  @IsUUID()
  vehicleId: string;

  @ApiProperty({ enum: TaxType, example: TaxType.IPVA })
  @IsEnum(TaxType)
  type: TaxType;

  @ApiProperty({ required: false, example: 2024 })
  @IsOptional()
  @IsInt()
  @Min(2000)
  year?: number;

  @ApiProperty({ required: false, example: '2024-03-31' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false, example: 1500.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @ApiProperty({ enum: PaymentStatus, required: false, default: PaymentStatus.PENDING })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({ required: false, example: '2024-03-15' })
  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @ApiProperty({ required: false, example: 1450.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paidValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
