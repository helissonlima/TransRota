import {
  IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ChecklistItemStatus, InspectionStatus } from '@transrota/shared';

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

  // --- New optional fields ---

  @ApiProperty({ required: false, description: 'ID do inspetor responsável' })
  @IsOptional()
  @IsUUID()
  inspectorId?: string;

  @ApiProperty({ required: false, example: 75, description: 'Nível de combustível em %' })
  @IsOptional()
  @IsNumber()
  fuelLevel?: number;

  @ApiProperty({ required: false, description: 'Descrição de danos externos' })
  @IsOptional()
  @IsString()
  externalDamage?: string;

  @ApiProperty({ required: false, description: 'Descrição de danos internos' })
  @IsOptional()
  @IsString()
  internalDamage?: string;

  @ApiProperty({ required: false, description: 'Localização/unidade do veículo' })
  @IsOptional()
  @IsString()
  unitLocation?: string;

  @ApiProperty({ required: false, type: [String], description: 'URLs de anexos (fotos, documentos)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @ApiProperty({ enum: InspectionStatus, required: false, default: InspectionStatus.PENDING })
  @IsOptional()
  @IsEnum(InspectionStatus)
  resolutionStatus?: InspectionStatus;

  @ApiProperty({ required: false, description: 'ID do usuário que resolveu' })
  @IsOptional()
  @IsUUID()
  resolvedById?: string;
}
