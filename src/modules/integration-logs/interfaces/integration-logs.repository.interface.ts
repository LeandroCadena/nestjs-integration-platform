import type { IntegrationLog, Prisma } from '@prisma/client';

export const INTEGRATION_LOGS_REPOSITORY = Symbol('INTEGRATION_LOGS_REPOSITORY');

export interface CreateIntegrationLogData {
  orderId?: string;
  provider: string;
  operation: string;
  status: string;
  requestBody?: Prisma.InputJsonValue;
  responseBody?: Prisma.InputJsonValue;
  errorMessage?: string;
  latencyMs?: number;
  correlationId: string;
}

export interface IntegrationLogsRepository {
  create(data: CreateIntegrationLogData): Promise<IntegrationLog>;
}
