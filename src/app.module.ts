import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app-config.module';
import { PrismaModule } from './database/prisma.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [AppConfigModule, PrismaModule, OrdersModule],
})
export class AppModule {}
