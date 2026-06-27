# Process Payment

## Overview

This use case describes how the platform processes a payment after an order is created.

The system uses an asynchronous event-driven flow. The Orders API is responsible for accepting and storing the order, while the Payment Worker processes the payment later through a queue.

---

## Business Goal

Process customer payments reliably while keeping the API fast and resilient to external provider failures.

---

## Trigger

An order is created through:

```http
POST /orders
```

After persisting the order, the system publishes a job to:

```txt
payment.queue
```

---

## Input

```json
{
  "orderId": "string",
  "correlationId": "string"
}
```

---

## Main Flow

1. `OrdersController` receives the request.
2. `OrdersService` creates a `correlationId`.
3. `OrdersRepository` persists the order in PostgreSQL.
4. `QueueService` publishes a `process-payment` job.
5. `PaymentWorker` consumes the job.
6. `PaymentWorker` loads the order from PostgreSQL.
7. The order status changes to `PAYMENT_PROCESSING`.
8. `FakeStripeAdapter` simulates the payment provider call.
9. `PaymentsRepository` creates the payment record.
10. The order status changes to `PAYMENT_SUCCEEDED`.
11. `IntegrationLogsRepository` stores the provider request, response, latency and correlation ID.

---

## Sequence

```txt
Client
  |
  v
POST /orders
  |
  v
OrdersController
  |
  v
OrdersService
  |
  v
OrdersRepository
  |
  v
PostgreSQL
  |
  v
QueueService
  |
  v
payment.queue
  |
  v
PaymentWorker
  |
  v
FakeStripeAdapter
  |
  v
PaymentsRepository
  |
  v
IntegrationLogsRepository
```

---

## Retry Strategy

The payment job is configured with:

```txt
attempts: 3
backoff: exponential
delay: 1000ms
```

If the worker throws an exception, BullMQ retries the job.

---

## Idempotency

The order includes an `idempotencyKey`.

This key is sent to the payment provider and will be used to avoid duplicated payment records when retries or duplicate jobs happen.

Current status:

```txt
Partially implemented
```

Future improvement:

```txt
Before creating a payment, verify if a payment already exists for the same idempotencyKey.
```

---

## Correlation ID

The same `correlationId` must be propagated through:

- Order
- Queue job
- Worker
- Fake Stripe request
- Payment
- Integration log
- Application logs

This allows debugging the full flow using a single identifier.

---

## Success Criteria

A successful execution must produce:

```txt
Order.status = PAYMENT_SUCCEEDED
Payment.status = SUCCEEDED
IntegrationLog.status = SUCCEEDED
```

---

## Failure Scenarios

| Scenario             | Expected Behavior                      |
| -------------------- | -------------------------------------- |
| Order does not exist | Worker throws error and job retries    |
| Provider timeout     | Worker throws error and job retries    |
| Provider error       | Worker throws error and job retries    |
| Duplicate message    | Idempotency prevents duplicate payment |
| Unknown job name     | Worker logs warning and ignores it     |

---

## Future Improvements

- Real Stripe SDK
- Dead Letter Queue
- Circuit Breaker
- Provider timeout handling
- Metrics with Prometheus
- Grafana dashboard
- OpenTelemetry tracing
- Payment webhook reconciliation
