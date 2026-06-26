import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import type {
  CreateIntegrationLogData,
  IntegrationLogsRepository,
} from '../interfaces/integration-logs.repository.interface';

@Injectable()
export class PrismaIntegrationLogsRepository implements IntegrationLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateIntegrationLogData) {
    return this.prisma.integrationLog.create({
      data: {
        provider: data.provider,
        operation: data.operation,
        status: data.status,
        requestBody: data.requestBody,
        responseBody: data.responseBody,
        errorMessage: data.errorMessage,
        latencyMs: data.latencyMs,
        correlationId: data.correlationId,
        ...(data.orderId
          ? {
              order: {
                connect: {
                  id: data.orderId,
                },
              },
            }
          : {}),
      },
    });
  }
}
