export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
}

export interface VehicleEntity {
  id: string;
  userId: string;
  plate?: string | null;
  brand: string;
  model: string;
  year: number;
  currentMileage: number;
  vin?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseType = 'FUEL' | 'MAINTENANCE' | 'INSURANCE' | 'TAX' | 'REPAIR' | 'OTHER';
export type ExpenseSource = 'MANUAL' | 'OCR' | 'AI_ADJUSTED';

export interface ExpenseEntity {
  id: string;
  userId: string;
  vehicleId: string;
  type: ExpenseType;
  amount: number;
  currency: string;
  date: Date;
  mileageAtExpense?: number | null;
  notes?: string | null;
  source: ExpenseSource;
}

export interface AttachmentEntity {
  id: string;
  expenseId: string;
  fileUrl: string;
  originalFileName: string;
  mimeType: string;
  createdAt: Date;
}

export type ReminderType = 'INSPECTION' | 'INSURANCE' | 'TAX' | 'MAINTENANCE' | 'CUSTOM';

export interface ReminderEntity {
  id: string;
  userId: string;
  vehicleId: string;
  type: ReminderType;
  dueDate: Date;
  isCompleted: boolean;
  completedAt?: Date | null;
  description?: string | null;
}

export type SubscriptionPlan = 'FREE' | 'PREMIUM' | 'FLEET_SMALL' | 'FLEET_MEDIUM' | 'FLEET_LARGE';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'TRIAL';

export interface SubscriptionEntity {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startedAt: Date;
  expiresAt?: Date | null;
}

export interface AIAnalysisResultEntity {
  id: string;
  userId: string;
  vehicleId: string;
  timeRangeStart?: Date | null;
  timeRangeEnd?: Date | null;
  summaryText: string;
  extraData: Record<string, unknown>;
  createdAt: Date;
}
