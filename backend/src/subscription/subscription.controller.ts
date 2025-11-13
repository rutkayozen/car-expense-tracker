import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ChangePlanDto } from './dto/change-plan.dto';
import { Request } from 'express';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('me')
  getMySubscription(@Req() req: Request) {
    return this.subscriptionService.getForUser((req as any).user.sub);
  }

  @Post('change-plan')
  changePlan(@Req() req: Request, @Body() dto: ChangePlanDto) {
    return this.subscriptionService.changePlan((req as any).user.sub, dto);
  }
}
