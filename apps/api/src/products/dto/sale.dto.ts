import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleOrderItemDto {
  @IsString() productId: string;
  @Type(() => Number) @IsNumber() @Min(0.001) quantity: number;
  @Type(() => Number) @IsNumber() @Min(0) unitPrice: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) discount?: number;
}

export class CreateSaleOrderDto {
  @IsString() clientName: string;
  @IsOptional() @IsString() clientDoc?: string;
  @IsOptional() @IsString() clientEmail?: string;
  @IsOptional() @IsString() clientPhone?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() dueDate?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => SaleOrderItemDto) items: SaleOrderItemDto[];
}
