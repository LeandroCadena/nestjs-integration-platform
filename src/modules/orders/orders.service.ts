import { Inject, Injectable } from '@nestjs/common';
import { CorrelationIdService } from '@/shared/correlation/correlation-id.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDERS_REPOSITORY } from './interfaces/orders.repository.interface';
import type { OrdersRepository } from './interfaces/orders.repository.interface';
import { QueueService } from '@/queues/queue.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
    private readonly correlationIdService: CorrelationIdService,
    private readonly queueService: QueueService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const correlationId = this.correlationIdService.generate();

    const order = await this.ordersRepository.create(createOrderDto, correlationId);

    await this.queueService.addPaymentJob({
      orderId: order.id,
      correlationId,
    });

    return order;
  }

  findAll() {
    return this.ordersRepository.findAll();
  }
}
