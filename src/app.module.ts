import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app-config.module';
import { PrismaModule } from './database/prisma.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CorrelationModule } from './shared/correlation/correlation.module';

@Module({
  imports: [AppConfigModule, PrismaModule, CorrelationModule, OrdersModule],
})
export class AppModule {}
