import { Inject, Injectable } from '@nestjs/common';
import { CorrelationIdService } from '@/shared/correlation/correlation-id.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDERS_REPOSITORY } from './interfaces/orders.repository.interface';
import type { OrdersRepository } from './interfaces/orders.repository.interface';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
    private readonly correlationIdService: CorrelationIdService,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const correlationId = this.correlationIdService.generate();

    return this.ordersRepository.create(createOrderDto, correlationId);
  }

  findAll() {
    return this.ordersRepository.findAll();
  }
}
