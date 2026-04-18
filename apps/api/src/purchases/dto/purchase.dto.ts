import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseOrderItemDto {
  @IsString() productId: string;
  @Type(() => Number) @IsNumber() @Min(0.001) quantity: number;
  @Type(() => Number) @IsNumber() @Min(0) unitPrice: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) discount?: number;
}

export class CreatePurchaseOrderDto {
  @IsString() supplierId: string;
  @IsOptional() @IsString() invoiceNumber?: string;
  @IsOptional() @IsBoolean() isPriceLocked?: boolean;
  @IsOptional() @IsBoolean() isSafra?: boolean;
  @IsOptional() @IsString() safra?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() dueDate?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => PurchaseOrderItemDto) items: PurchaseOrderItemDto[];
}

export class ReceiveItemDto {
  @IsString() itemId: string;
  @Type(() => Number) @IsNumber() @Min(0.001) receivedQty: number;
}

export class ReceivePurchaseDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => ReceiveItemDto) items: ReceiveItemDto[];
}
