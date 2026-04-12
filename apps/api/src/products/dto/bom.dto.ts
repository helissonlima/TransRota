import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BOMItemDto {
  @IsString() componentId: string;
  @Type(() => Number) @IsNumber() @Min(0.001) quantity: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) lossPercent?: number;
  @IsOptional() @IsString() notes?: string;
}

export class UpsertBOMDto {
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0.001) yield?: number;
  @IsOptional() @IsString() notes?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => BOMItemDto) items: BOMItemDto[];
}
