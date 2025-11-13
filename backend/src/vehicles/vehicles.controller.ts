import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Request } from 'express';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  list(@Req() req: Request) {
    return this.vehiclesService.listForUser((req as any).user.sub);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.createForUser((req as any).user.sub, dto);
  }

  @Get(':id')
  get(@Req() req: Request, @Param('id') id: string) {
    return this.vehiclesService.findOwnedById((req as any).user.sub, id);
  }

  @Put(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update((req as any).user.sub, id, dto);
  }

  @Delete(':id')
  delete(@Req() req: Request, @Param('id') id: string) {
    return this.vehiclesService.remove((req as any).user.sub, id);
  }
}
