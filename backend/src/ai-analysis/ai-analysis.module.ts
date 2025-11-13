import { Module } from '@nestjs/common';
import { AIAnalysisService } from './ai-analysis.service';
import { AIAnalysisController } from './ai-analysis.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, VehiclesModule, AiModule],
  providers: [AIAnalysisService],
  controllers: [AIAnalysisController],
})
export class AIAnalysisModule {}
