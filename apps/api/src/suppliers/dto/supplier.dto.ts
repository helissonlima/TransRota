import { IsString, IsOptional, IsBoolean, IsEmail } from "class-validator";

export class CreateSupplierDto {
  @IsString() name: string;
  @IsOptional() @IsString() photoUrl?: string;
  @IsOptional() @IsString() tradeName?: string;
  @IsOptional() @IsString() cnpj?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() contactName?: string;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateSupplierDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() photoUrl?: string;
  @IsOptional() @IsString() tradeName?: string;
  @IsOptional() @IsString() cnpj?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() contactName?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() notes?: string;
}

export class LinkSupplierProductDto {
  @IsString() productId: string;
  @IsOptional() @IsString() supplierSku?: string;
  @IsOptional() unitPrice?: number;
  @IsOptional() @IsString() notes?: string;
}
