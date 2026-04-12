import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ResolveStatus {
  RESOLVED = 'RESOLVED',
  APPROVED = 'APPROVED',
}

export class ResolveExecutionDto {
  @ApiProperty({ enum: ResolveStatus, description: 'Novo status da execução' })
  @IsEnum(ResolveStatus)
  status: ResolveStatus;
}
