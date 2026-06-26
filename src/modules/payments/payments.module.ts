import { Module } from '@nestjs/common';

import { PAYMENTS_REPOSITORY } from './interfaces/payments.repository.interface';
import { PrismaPaymentsRepository } from './repositories/prisma-payments.repository';

@Module({
  providers: [
    {
      provide: PAYMENTS_REPOSITORY,
      useClass: PrismaPaymentsRepository,
    },
  ],
  exports: [PAYMENTS_REPOSITORY],
})
export class PaymentsModule {}
