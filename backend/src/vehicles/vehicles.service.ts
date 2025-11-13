import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    return this.prisma.vehicle.findMany({ where: { userId } });
  }

  async createForUser(userId: string, dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        userId,
        brand: dto.brand,
        model: dto.model,
        year: dto.year,
        currentMileage: dto.currentMileage,
        plate: dto.plate,
        vin: dto.vin,
      },
    });
  }

  async findOwnedById(userId: string, id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        aiResults: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    if (vehicle.userId !== userId) {
      throw new ForbiddenException();
    }
    return vehicle;
  }

  async update(userId: string, id: string, dto: UpdateVehicleDto) {
    await this.findOwnedById(userId, id);
    return this.prisma.vehicle.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOwnedById(userId, id);
    await this.prisma.vehicle.delete({ where: { id } });
    return { success: true };
  }
}
