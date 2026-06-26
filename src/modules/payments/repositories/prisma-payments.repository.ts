import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import type {
  CreatePaymentData,
  PaymentsRepository,
} from '../interfaces/payments.repository.interface';

@Injectable()
export class PrismaPaymentsRepository implements PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createSucceededPayment(data: CreatePaymentData) {
    return this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        provider: data.provider,
        amount: data.amount,
        currency: data.currency,
        idempotencyKey: data.idempotencyKey,
        externalPaymentId: data.externalPaymentId,
        status: 'SUCCEEDED',
      },
    });
  }
}
