import {
  IsArray, IsEnum, IsOptional, IsString, IsUUID, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ChecklistItemStatus } from '@transrota/shared';

class ChecklistResponseDto {
  @IsUUID()
  itemId: string;

  @IsEnum(ChecklistItemStatus)
  status: ChecklistItemStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class ExecuteChecklistDto {
  @ApiProperty()
  @IsUUID()
  vehicleId: string;

  @ApiProperty()
  @IsUUID()
  driverId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  routeId?: string;

  @ApiProperty({ type: [ChecklistResponseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistResponseDto)
  responses: ChecklistResponseDto[];
}
