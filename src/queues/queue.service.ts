import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { PAYMENT_QUEUE, QUEUE_JOB_NAMES } from './queue.constants';

export interface ProcessPaymentJob {
  orderId: string;
  correlationId: string;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(PAYMENT_QUEUE)
    private readonly paymentQueue: Queue<ProcessPaymentJob>,
  ) {}

  async addPaymentJob(data: ProcessPaymentJob): Promise<void> {
    await this.paymentQueue.add(QUEUE_JOB_NAMES.PROCESS_PAYMENT, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: false,
    });
  }
}
