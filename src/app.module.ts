import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app-config.module';
import { PrismaModule } from './database/prisma.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CorrelationModule } from './shared/correlation/correlation.module';
import { BullmqModule } from './queues/bullmq.module';
import { PaymentWorkerModule } from './workers/payment/payment-worker.module';
import { AppLoggerModule } from './shared/logger/logger.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    HealthModule,
    PrismaModule,
    CorrelationModule,
    BullmqModule,
    OrdersModule,
    PaymentWorkerModule,
  ],
})
export class AppModule {}
