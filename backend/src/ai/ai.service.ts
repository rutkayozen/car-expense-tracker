import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AIAnalysisResultEntity } from '../common/entities';

@Injectable()
export class AIService {
  /**
   * Mock AI analysis that provides a static but contextual analysis result.
   */
  async analyzeVehicleExpenses(
    vehicleId: string,
    timeRange?: { start?: string; end?: string },
  ): Promise<AIAnalysisResultEntity> {
    const now = new Date();
    return {
      id: randomUUID(),
      userId: 'mock-user',
      vehicleId,
      timeRangeStart: timeRange?.start ? new Date(timeRange.start) : undefined,
      timeRangeEnd: timeRange?.end ? new Date(timeRange.end) : undefined,
      summaryText: `Vehicle ${vehicleId} shows increased fuel consumption. Consider scheduling a maintenance check.`,
      extraData: {
        averageMonthlyExpense: 250,
        topExpenseType: 'FUEL',
        suggestedActions: ['Check tire pressure', 'Review driving habits'],
      },
      createdAt: now,
    };
  }
}
