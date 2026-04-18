import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class SaleOrderItemDto {
  @IsString() productId: string;
  @Type(() => Number) @IsNumber() @Min(0.001) quantity: number;
  @Type(() => Number) @IsNumber() @Min(0) unitPrice: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) discount?: number;
}

export class CreateSaleOrderDto {
  @IsOptional() @IsString() clientId?: string;
  @IsString() clientName: string;
  @IsOptional() @IsString() clientDoc?: string;
  @IsOptional() @IsString() clientEmail?: string;
  @IsOptional() @IsString() clientPhone?: string;
  @IsOptional() @IsString() clientAddress?: string;
  @IsOptional() @IsString() sellerId?: string;
  @IsOptional() @IsString() supplierId?: string;
  @IsOptional() @IsBoolean() isPriceLocked?: boolean;
  @IsOptional() @IsBoolean() isSafra?: boolean;
  @IsOptional() @IsString() safra?: string;
  @IsOptional() @IsString() invoiceNumber?: string;
  @IsOptional() @IsString() paymentMethod?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() dueDate?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleOrderItemDto)
  items: SaleOrderItemDto[];
}

export class UpdateSaleDeliveryDto {
  @IsString() deliveryStatus: string;
  @IsOptional() @IsString() notes?: string;
}
