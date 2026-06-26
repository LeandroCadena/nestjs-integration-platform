import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrdersRepository } from '../interfaces/orders.repository.interface';
import type { OrderStatus } from '../../../../generated/prisma';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateOrderDto, correlationId: string) {
    return this.prisma.order.create({
      data: {
        customerName: data.customerName,
        amount: data.amount,
        currency: data.currency,
        idempotencyKey: data.idempotencyKey,
        correlationId,
      },
    });
  }

  findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
