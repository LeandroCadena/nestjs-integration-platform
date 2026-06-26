import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdService {
  generate(): string {
    return randomUUID();
  }
}
