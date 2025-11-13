import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService, private readonly vehiclesService: VehiclesService) {}

  async listForVehicle(userId: string, vehicleId: string) {
    await this.vehiclesService.findOwnedById(userId, vehicleId);
    return this.prisma.reminder.findMany({
      where: { vehicleId },
      orderBy: { dueDate: 'asc' },
    });
  }

  async create(userId: string, vehicleId: string, dto: CreateReminderDto) {
    await this.vehiclesService.findOwnedById(userId, vehicleId);
    return this.prisma.reminder.create({
      data: {
        userId,
        vehicleId,
        type: dto.type,
        dueDate: new Date(dto.dueDate),
        description: dto.description,
      },
    });
  }

  async markComplete(userId: string, reminderId: string) {
    const reminder = await this.prisma.reminder.findUnique({ where: { id: reminderId } });
    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }
    if (reminder.userId !== userId) {
      throw new ForbiddenException();
    }
    return this.prisma.reminder.update({
      where: { id: reminderId },
      data: { isCompleted: true, completedAt: new Date() },
    });
  }
}
