import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
  imports: [PrismaModule, VehiclesModule],
  providers: [RemindersService],
  controllers: [RemindersController],
})
export class RemindersModule {}
