import {
  IsDateString, IsEnum, IsOptional, IsString, IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '@transrota/shared';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  vehicleId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  branchId?: string;

  @ApiProperty({ example: '2024-01-20' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '08:00-12:00', description: 'Período/horário reservado' })
  @IsString()
  timeSlot: string;

  @ApiProperty({ required: false, example: 'Visita a cliente' })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiProperty({ enum: BookingStatus, required: false, default: BookingStatus.PENDING })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
