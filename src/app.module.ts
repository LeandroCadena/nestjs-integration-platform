import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app-config.module';
import { PrismaModule } from './database/prisma.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CorrelationModule } from './shared/correlation/correlation.module';
import { BullmqModule } from './queues/bullmq.module';

@Module({
  imports: [AppConfigModule, PrismaModule, CorrelationModule, BullmqModule, OrdersModule],
})
export class AppModule {}
