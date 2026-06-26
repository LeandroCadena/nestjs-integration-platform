import { Module } from '@nestjs/common';

import { FakeStripeAdapter } from './fake-stripe.adapter';
import { PAYMENT_PROVIDER } from './interfaces/payment-provider.interface';

@Module({
  providers: [
    {
      provide: PAYMENT_PROVIDER,
      useClass: FakeStripeAdapter,
    },
  ],
  exports: [PAYMENT_PROVIDER],
})
export class FakeStripeModule {}
