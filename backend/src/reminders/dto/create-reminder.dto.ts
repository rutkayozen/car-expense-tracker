import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ReminderType } from '../../common/entities';

export class CreateReminderDto {
  @IsEnum(['INSPECTION', 'INSURANCE', 'TAX', 'MAINTENANCE', 'CUSTOM'])
  type: ReminderType;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsString()
  description?: string;
}
