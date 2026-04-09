import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Transportadora Exemplo Ltda' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsString()
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, { message: 'CNPJ inválido' })
  cnpj: string;

  @ApiProperty({ example: 'contato@empresa.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '(11) 99999-9999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Admin da Empresa' })
  @IsString()
  @IsNotEmpty()
  adminName: string;

  @ApiProperty({ example: 'admin@empresa.com' })
  @IsEmail()
  adminEmail: string;

  @ApiProperty({ example: 'SenhaForte@123' })
  @IsString()
  @Length(8, 64)
  adminPassword: string;
}
