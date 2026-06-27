import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import type { Job } from 'bullmq';

import {
  PAYMENT_PROVIDER,
  type PaymentProvider,
} from '@/integrations/fake-stripe/interfaces/payment-provider.interface';
import {
  INTEGRATION_LOGS_REPOSITORY,
  type IntegrationLogsRepository,
} from '@/modules/integration-logs/interfaces/integration-logs.repository.interface';
import {
  ORDERS_REPOSITORY,
  type OrdersRepository,
} from '@/modules/orders/interfaces/orders.repository.interface';
import {
  PAYMENTS_REPOSITORY,
  type PaymentsRepository,
} from '@/modules/payments/interfaces/payments.repository.interface';
import { PAYMENT_QUEUE, QUEUE_JOB_NAMES } from '@/queues/queue.constants';
import type { ProcessPaymentJob } from '@/queues/queue.service';

@Injectable()
@Processor(PAYMENT_QUEUE)
export class PaymentWorker extends WorkerHost {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
    @Inject(PAYMENT_PROVIDER)
    private readonly paymentProvider: PaymentProvider,
    @Inject(PAYMENTS_REPOSITORY)
    private readonly paymentsRepository: PaymentsRepository,
    @Inject(INTEGRATION_LOGS_REPOSITORY)
    private readonly integrationLogsRepository: IntegrationLogsRepository,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<ProcessPaymentJob>): Promise<void> {
    if (job.name !== QUEUE_JOB_NAMES.PROCESS_PAYMENT) {
      this.logger.warn(
        {
          jobName: job.name,
        },
        'Unknown payment job received',
      );
      return;
    }

    const { orderId, correlationId } = job.data;
    const startedAt = Date.now();

    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    const existingPayment = await this.paymentsRepository.findByIdempotencyKey(
      order.idempotencyKey,
    );

    if (existingPayment) {
      this.logger.log(
        {
          orderId: order.id,
          correlationId,
          paymentId: existingPayment.id,
          idempotencyKey: order.idempotencyKey,
        },
        'Payment already processed, skipping provider call',
      );

      await this.ordersRepository.updateStatus(order.id, 'PAYMENT_SUCCEEDED');

      return;
    }

    await this.ordersRepository.updateStatus(order.id, 'PAYMENT_PROCESSING');

    const paymentResult = await this.paymentProvider.processPayment({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      idempotencyKey: order.idempotencyKey,
      correlationId,
    });

    await this.paymentsRepository.createSucceededPayment({
      orderId: order.id,
      provider: 'fake-stripe',
      amount: order.amount,
      currency: order.currency,
      idempotencyKey: order.idempotencyKey,
      externalPaymentId: paymentResult.externalPaymentId,
    });

    await this.ordersRepository.updateStatus(order.id, 'PAYMENT_SUCCEEDED');

    await this.integrationLogsRepository.create({
      orderId: order.id,
      provider: 'fake-stripe',
      operation: 'process-payment',
      status: paymentResult.status,
      requestBody: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      responseBody: paymentResult.rawResponse,
      latencyMs: Date.now() - startedAt,
      correlationId,
    });

    this.logger.log(
      {
        orderId: order.id,
        correlationId,
        externalPaymentId: paymentResult.externalPaymentId,
        provider: 'fake-stripe',
        durationMs: Date.now() - startedAt,
      },
      'Payment processed successfully',
    );
  }
}
