import { IsString, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum StockMovementType {
  ENTRY = 'ENTRY', EXIT = 'EXIT', ADJUSTMENT = 'ADJUSTMENT',
  PRODUCTION_IN = 'PRODUCTION_IN', PRODUCTION_OUT = 'PRODUCTION_OUT',
  SALE_OUT = 'SALE_OUT', TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT', LOSS = 'LOSS',
}

export class CreateStockMovementDto {
  @IsString() productId: string;
  @IsEnum(StockMovementType) type: StockMovementType;
  @Type(() => Number) @IsNumber() @Min(0.001) quantity: number;
  @IsOptional() @Type(() => Number) @IsNumber() unitCost?: number;
  @IsOptional() @IsString() locationId?: string;
  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsString() referenceId?: string;
}
