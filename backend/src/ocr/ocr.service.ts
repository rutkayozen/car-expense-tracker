import { Injectable } from '@nestjs/common';
import { ExpenseSource, ExpenseType } from '../common/entities';

@Injectable()
export class OcrService {
  /**
   * Mock OCR parsing that returns a sample expense payload extracted from a receipt.
   */
  async parseReceipt(fileUrl: string): Promise<Partial<{ type: ExpenseType; amount: number; currency: string; source: ExpenseSource }>> {
    // Mocked response simulating OCR result
    return {
      type: 'FUEL',
      amount: 42.5,
      currency: 'USD',
      source: 'OCR',
    };
  }
}
