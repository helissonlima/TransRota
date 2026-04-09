import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDocumentDto {
  @ApiProperty({ example: 'ASO' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Atestado de Saúde Ocupacional 2024' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsUrl()
  fileUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
