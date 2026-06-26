import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@/database/prisma.service';

import type {
  CreateIntegrationLogData,
  IntegrationLogsRepository,
} from '../interfaces/integration-logs.repository.interface';

@Injectable()
export class PrismaIntegrationLogsRepository implements IntegrationLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateIntegrationLogData) {
    const createData: Prisma.IntegrationLogCreateInput = {
      provider: data.provider,
      operation: data.operation,
      status: data.status,
      correlationId: data.correlationId,
      ...(data.requestBody !== undefined ? { requestBody: data.requestBody } : {}),
      ...(data.responseBody !== undefined ? { responseBody: data.responseBody } : {}),
      ...(data.errorMessage !== undefined ? { errorMessage: data.errorMessage } : {}),
      ...(data.latencyMs !== undefined ? { latencyMs: data.latencyMs } : {}),
      ...(data.orderId
        ? {
            order: {
              connect: {
                id: data.orderId,
              },
            },
          }
        : {}),
    };

    return this.prisma.integrationLog.create({
      data: createData,
    });
  }
}
