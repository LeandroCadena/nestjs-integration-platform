import { Module } from '@nestjs/common';

import { BullmqModule } from '@/queues/bullmq.module';

import { ORDERS_REPOSITORY } from './interfaces/orders.repository.interface';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaOrdersRepository } from './repositories/prisma-orders.repository';

@Module({
  imports: [BullmqModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: ORDERS_REPOSITORY,
      useClass: PrismaOrdersRepository,
    },
  ],
  exports: [ORDERS_REPOSITORY],
})
export class OrdersModule {}
