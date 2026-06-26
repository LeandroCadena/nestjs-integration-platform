import { Order, OrderStatus } from '@prisma/client';
import { CreateOrderDto } from '../dto/create-order.dto';

export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY');

export interface OrdersRepository {
  create(data: CreateOrderDto, correlationId: string): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  findAll(): Promise<Order[]>;
}
