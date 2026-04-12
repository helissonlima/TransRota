import { IsString, IsOptional, IsEnum, IsNumber, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductType {
  RAW_MATERIAL = 'RAW_MATERIAL',
  SEMI_FINISHED = 'SEMI_FINISHED',
  FINISHED_GOOD = 'FINISHED_GOOD',
  SERVICE = 'SERVICE',
}

export enum UnitOfMeasure {
  UN = 'UN', KG = 'KG', G = 'G', L = 'L', ML = 'ML',
  M = 'M', CM = 'CM', M2 = 'M2', M3 = 'M3', CX = 'CX',
  PC = 'PC', PR = 'PR', FD = 'FD', SC = 'SC',
}

export class CreateProductDto {
  @IsString() name: string;
  @IsString() sku: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(ProductType) type?: ProductType;
  @IsOptional() @IsEnum(UnitOfMeasure) unit?: UnitOfMeasure;
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @Type(() => Number) @IsNumber() costPrice?: number;
  @IsOptional() @Type(() => Number) @IsNumber() salePrice?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) minStock?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) maxStock?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() barcode?: string;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateProductDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(ProductType) type?: ProductType;
  @IsOptional() @IsEnum(UnitOfMeasure) unit?: UnitOfMeasure;
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @Type(() => Number) @IsNumber() costPrice?: number;
  @IsOptional() @Type(() => Number) @IsNumber() salePrice?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) minStock?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) maxStock?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() barcode?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() notes?: string;
}

export class CreateCategoryDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() color?: string;
}
