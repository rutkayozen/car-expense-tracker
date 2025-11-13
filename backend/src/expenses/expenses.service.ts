import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ExpenseType, ExpenseSource } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { OcrService } from '../ocr/ocr.service';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vehiclesService: VehiclesService,
    private readonly ocrService: OcrService,
  ) {}

  async listForVehicle(userId: string, vehicleId: string, filters?: { type?: string; startDate?: string; endDate?: string }) {
    await this.vehiclesService.findOwnedById(userId, vehicleId);

    return this.prisma.expense.findMany({
      where: {
        vehicleId,
        ...(filters?.type ? { type: filters.type as ExpenseType } : {}),
        ...(filters?.startDate || filters?.endDate
          ? {
              date: {
                gte: filters?.startDate ? new Date(filters.startDate) : undefined,
                lte: filters?.endDate ? new Date(filters.endDate) : undefined,
              },
            }
          : {}),
      },
      orderBy: { date: 'desc' },
      include: { attachments: true },
    });
  }

  async create(userId: string, vehicleId: string, dto: CreateExpenseDto) {
    await this.vehiclesService.findOwnedById(userId, vehicleId);

    let merged = { ...dto };
    if (dto.receiptFileUrl) {
      const ocrResult = await this.ocrService.parseReceipt(dto.receiptFileUrl);
      merged = {
        ...merged,
        ...ocrResult,
        source: (ocrResult.source as ExpenseSource) ?? 'OCR',
      };
    }

    return this.prisma.expense.create({
      data: {
        userId,
        vehicleId,
        type: (merged.type ?? dto.type) as ExpenseType,
        amount: new Prisma.Decimal(merged.amount ?? dto.amount),
        currency: merged.currency ?? dto.currency,
        date: new Date(merged.date ?? dto.date),
        mileageAtExpense: merged.mileageAtExpense ?? dto.mileageAtExpense,
        notes: merged.notes ?? dto.notes,
        source: ((merged.source as ExpenseSource) || 'MANUAL') as ExpenseSource,
        attachments: merged.attachments
          ? {
              create: merged.attachments.map((attachment) => ({
                fileUrl: attachment.fileUrl,
                originalFileName: attachment.originalFileName,
                mimeType: attachment.mimeType,
              })),
            }
          : undefined,
      },
      include: { attachments: true },
    });
  }

  async findById(userId: string, id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: { attachments: true },
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    if (expense.userId !== userId) {
      throw new ForbiddenException();
    }
    return expense;
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    await this.findById(userId, id);
    return this.prisma.expense.update({
      where: { id },
      data: {
        ...dto,
        amount: dto.amount !== undefined ? new Prisma.Decimal(dto.amount) : undefined,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: { attachments: true },
    });
  }

  async remove(userId: string, id: string) {
    await this.findById(userId, id);
    await this.prisma.attachment.deleteMany({ where: { expenseId: id } });
    await this.prisma.expense.delete({ where: { id } });
    return { success: true };
  }
}
