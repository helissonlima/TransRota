import {
  IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DailyKmStatus } from '@transrota/shared';

export class CreateDailyKmDto {
  @ApiProperty()
  @IsUUID()
  vehicleId: string;

  @ApiProperty()
  @IsUUID()
  driverId: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ required: false, example: 'Segunda-feira' })
  @IsOptional()
  @IsString()
  dayOfWeek?: string;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @Min(0)
  initialKm: number;

  @ApiProperty({ example: 45300 })
  @IsNumber()
  @Min(0)
  finalKm: number;

  @ApiProperty({ required: false, example: 45000, description: 'KM inicial para uso pessoal' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  personalInitialKm?: number;

  @ApiProperty({ required: false, example: 45050, description: 'KM final para uso pessoal' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  personalFinalKm?: number;

  @ApiProperty({ enum: DailyKmStatus, required: false, default: DailyKmStatus.OK })
  @IsOptional()
  @IsEnum(DailyKmStatus)
  status?: DailyKmStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
