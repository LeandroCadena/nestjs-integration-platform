import type { Prisma } from '@prisma/client';

export interface ProcessPaymentInput {
  orderId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
  correlationId: string;
}

export interface ProcessPaymentResult {
  externalPaymentId: string;
  status: 'SUCCEEDED' | 'FAILED';
  rawResponse: Prisma.InputJsonValue;
}

export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');

export interface PaymentProvider {
  processPayment(input: ProcessPaymentInput): Promise<ProcessPaymentResult>;
}
