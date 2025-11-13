import { Body, Controller, Post, Req } from '@nestjs/common';
import { AIAnalysisService } from './ai-analysis.service';
import { AnalyzeVehicleDto } from './dto/analyze-vehicle.dto';
import { Request } from 'express';

@Controller('ai/analysis')
export class AIAnalysisController {
  constructor(private readonly aiAnalysisService: AIAnalysisService) {}

  @Post('vehicle')
  analyzeVehicle(@Req() req: Request, @Body() dto: AnalyzeVehicleDto) {
    return this.aiAnalysisService.analyzeVehicle((req as any).user.sub, dto);
  }
}
