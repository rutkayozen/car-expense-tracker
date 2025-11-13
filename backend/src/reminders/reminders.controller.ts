import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { Request } from 'express';

@Controller()
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get('vehicles/:vehicleId/reminders')
  list(@Req() req: Request, @Param('vehicleId') vehicleId: string) {
    return this.remindersService.listForVehicle((req as any).user.sub, vehicleId);
  }

  @Post('vehicles/:vehicleId/reminders')
  create(@Req() req: Request, @Param('vehicleId') vehicleId: string, @Body() dto: CreateReminderDto) {
    return this.remindersService.create((req as any).user.sub, vehicleId, dto);
  }

  @Patch('reminders/:id/complete')
  complete(@Req() req: Request, @Param('id') id: string) {
    return this.remindersService.markComplete((req as any).user.sub, id);
  }
}
