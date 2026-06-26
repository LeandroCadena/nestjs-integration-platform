import type { Payment } from '@prisma/client';

export const PAYMENTS_REPOSITORY = Symbol('PAYMENTS_REPOSITORY');

export interface CreatePaymentData {
  orderId: string;
  provider: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
  externalPaymentId?: string;
}

export interface PaymentsRepository {
  createSucceededPayment(data: CreatePaymentData): Promise<Payment>;
}
