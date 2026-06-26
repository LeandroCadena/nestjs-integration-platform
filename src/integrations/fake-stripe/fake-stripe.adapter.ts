import { Injectable } from '@nestjs/common';

import type {
  PaymentProvider,
  ProcessPaymentInput,
  ProcessPaymentResult,
} from './interfaces/payment-provider.interface';

@Injectable()
export class FakeStripeAdapter implements PaymentProvider {
  async processPayment(input: ProcessPaymentInput): Promise<ProcessPaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      externalPaymentId: `fake_stripe_${input.orderId}`,
      status: 'SUCCEEDED',
      rawResponse: {
        provider: 'fake-stripe',
        orderId: input.orderId,
        amount: input.amount,
        currency: input.currency,
        correlationId: input.correlationId,
      },
    };
  }
}
