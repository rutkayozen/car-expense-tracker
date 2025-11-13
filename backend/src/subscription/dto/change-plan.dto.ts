import { IsEnum } from 'class-validator';
import { SubscriptionPlan } from '../../common/entities';

export class ChangePlanDto {
  @IsEnum(['FREE', 'PREMIUM', 'FLEET_SMALL', 'FLEET_MEDIUM', 'FLEET_LARGE'])
  plan: SubscriptionPlan;
}
