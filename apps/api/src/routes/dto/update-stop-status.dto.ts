import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StopStatus, NonDeliveryReason } from '@transrota/shared';

export class UpdateStopStatusDto {
  @ApiProperty({ enum: StopStatus })
  @IsEnum(StopStatus)
  status: StopStatus;

  @ApiProperty({ enum: NonDeliveryReason, required: false })
  @IsOptional()
  @IsEnum(NonDeliveryReason)
  nonDeliveryReason?: NonDeliveryReason;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  arrivedAt?: string;
}
