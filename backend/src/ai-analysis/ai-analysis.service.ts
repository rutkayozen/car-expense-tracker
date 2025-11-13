import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { AIService } from '../ai/ai.service';
import { AnalyzeVehicleDto } from './dto/analyze-vehicle.dto';

@Injectable()
export class AIAnalysisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vehiclesService: VehiclesService,
    private readonly aiService: AIService,
  ) {}

  async analyzeVehicle(userId: string, dto: AnalyzeVehicleDto) {
    await this.vehiclesService.findOwnedById(userId, dto.vehicleId);

    const result = await this.aiService.analyzeVehicleExpenses(dto.vehicleId, dto.timeRange);

    return this.prisma.aIAnalysisResult.create({
      data: {
        userId,
        vehicleId: dto.vehicleId,
        timeRangeStart: dto.timeRange?.start ? new Date(dto.timeRange.start) : undefined,
        timeRangeEnd: dto.timeRange?.end ? new Date(dto.timeRange.end) : undefined,
        summaryText: result.summaryText,
        extraData: result.extraData,
      },
    });
  }
}
