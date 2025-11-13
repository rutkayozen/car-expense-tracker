import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDto } from './attachment.dto';
import { ExpenseSource, ExpenseType } from '../../common/entities';

export class CreateExpenseDto {
  @IsEnum(['FUEL', 'MAINTENANCE', 'INSURANCE', 'TAX', 'REPAIR', 'OTHER'])
  type: ExpenseType;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  mileageAtExpense?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  receiptFileUrl?: string;

  @IsOptional()
  @IsEnum(['MANUAL', 'OCR', 'AI_ADJUSTED'])
  source?: ExpenseSource;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
