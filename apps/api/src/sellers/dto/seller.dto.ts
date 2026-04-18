import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSellerDto {
  @IsString() name: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @Type(() => Number) @IsNumber() commission?: number;
}

export class UpdateSellerDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @Type(() => Number) @IsNumber() commission?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
