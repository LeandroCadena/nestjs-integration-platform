import { Module } from '@nestjs/common';
import { ORDERS_REPOSITORY } from './interfaces/orders.repository.interface';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaOrdersRepository } from './repositories/prisma-orders.repository';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: ORDERS_REPOSITORY,
      useClass: PrismaOrdersRepository,
    },
  ],
})
export class OrdersModule {}
