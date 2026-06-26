import { Module } from '@nestjs/common';

import { FakeStripeModule } from '@/integrations/fake-stripe/fake-stripe.module';
import { IntegrationLogsModule } from '@/modules/integration-logs/integration-logs.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { PaymentsModule } from '@/modules/payments/payments.module';
import { BullmqModule } from '@/queues/bullmq.module';

import { PaymentWorker } from './payment.worker';

@Module({
  imports: [BullmqModule, OrdersModule, PaymentsModule, IntegrationLogsModule, FakeStripeModule],
  providers: [PaymentWorker],
})
export class PaymentWorkerModule {}
