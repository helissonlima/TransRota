import {
  IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber,
  IsOptional, IsString, IsUUID, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ChecklistType } from '@transrota/shared';

class ChecklistItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  allowPhoto?: boolean;

  @IsOptional()
  @IsBoolean()
  allowNotes?: boolean;
}

export class CreateChecklistDto {
  @ApiProperty({ example: 'Checklist de Saída' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ChecklistType })
  @IsEnum(ChecklistType)
  type: ChecklistType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  branchId?: string;

  @ApiProperty({ type: [ChecklistItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];
}
