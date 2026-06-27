import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;

    const statusCode = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = isHttpException ? exception.getResponse() : null;

    const message =
      typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse
        ? errorResponse.message
        : isHttpException
          ? exception.message
          : 'Unexpected error';

    this.logger.error(
      {
        statusCode,
        path: request.url,
        method: request.method,
        exception,
      },
      'Request failed',
    );

    response.status(statusCode).json({
      statusCode,
      error: isHttpException ? exception.name : 'InternalServerError',
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
