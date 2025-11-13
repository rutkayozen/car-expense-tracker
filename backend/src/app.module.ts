import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ExpensesModule } from './expenses/expenses.module';
import { RemindersModule } from './reminders/reminders.module';
import { AIAnalysisModule } from './ai-analysis/ai-analysis.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    VehiclesModule,
    ExpensesModule,
    RemindersModule,
    AIAnalysisModule,
    SubscriptionModule,
  ],
})
export class AppModule {}
