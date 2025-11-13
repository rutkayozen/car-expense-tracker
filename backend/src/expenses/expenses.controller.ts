import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Request } from 'express';

@Controller()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('vehicles/:vehicleId/expenses')
  listForVehicle(
    @Req() req: Request,
    @Param('vehicleId') vehicleId: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expensesService.listForVehicle((req as any).user.sub, vehicleId, { type, startDate, endDate });
  }

  @Post('vehicles/:vehicleId/expenses')
  createForVehicle(@Req() req: Request, @Param('vehicleId') vehicleId: string, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create((req as any).user.sub, vehicleId, dto);
  }

  @Get('expenses/:id')
  getExpense(@Req() req: Request, @Param('id') id: string) {
    return this.expensesService.findById((req as any).user.sub, id);
  }

  @Put('expenses/:id')
  updateExpense(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.expensesService.update((req as any).user.sub, id, dto);
  }

  @Delete('expenses/:id')
  deleteExpense(@Req() req: Request, @Param('id') id: string) {
    return this.expensesService.remove((req as any).user.sub, id);
  }
}
