import {
  IsArray, IsNumber, IsOptional, IsString, IsUUID, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DeliveredItemDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  deliveredQuantity: number;
}

export class AddDeliveryProofDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  signatureUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  receiverName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  receiverDocument?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveredItemDto)
  deliveredItems?: DeliveredItemDto[];
}
