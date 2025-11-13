import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePlanDto } from './dto/change-plan.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getForUser(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    if (subscription) {
      return subscription;
    }

    return this.prisma.subscription.create({
      data: {
        userId,
        plan: 'FREE',
        status: 'TRIAL',
      },
    });
  }

  async changePlan(userId: string, dto: ChangePlanDto) {
    await this.getForUser(userId);
    return this.prisma.subscription.update({
      where: { userId },
      data: {
        plan: dto.plan,
        status: 'ACTIVE',
        startedAt: new Date(),
        expiresAt: null,
      },
    });
  }
}
