import { Module } from '@nestjs/common';

import { INTEGRATION_LOGS_REPOSITORY } from './interfaces/integration-logs.repository.interface';
import { PrismaIntegrationLogsRepository } from './repositories/prisma-integration-logs.repository';

@Module({
  providers: [
    {
      provide: INTEGRATION_LOGS_REPOSITORY,
      useClass: PrismaIntegrationLogsRepository,
    },
  ],
  exports: [INTEGRATION_LOGS_REPOSITORY],
})
export class IntegrationLogsModule {}
