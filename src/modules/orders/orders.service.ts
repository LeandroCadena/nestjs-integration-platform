import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDERS_REPOSITORY } from './interfaces/orders.repository.interface';
import type { OrdersRepository } from './interfaces/orders.repository.interface';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const correlationId = randomUUID();

    return this.ordersRepository.create(createOrderDto, correlationId);
  }

  findAll() {
    return this.ordersRepository.findAll();
  }
}
