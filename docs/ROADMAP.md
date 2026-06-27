# Process Payment

## Overview

This use case describes how an order is processed after being created.

The system follows an asynchronous event-driven architecture where order creation and payment processing are decoupled through a queue.

---

# Business Goal

Process a customer payment reliably while guaranteeing:

- Idempotency
- Retry capability
- Traceability
- Scalability
- Observability

---

# Trigger

An order is successfully created.

```http
POST /orders
```

The OrdersService stores the order and publishes a message to the payment queue.

---

# Input

| Field         | Type | Description                                           |
| ------------- | ---- | ----------------------------------------------------- |
| orderId       | UUID | Internal order identifier                             |
| correlationId | UUID | Trace identifier propagated through the complete flow |

Example

```json
{
  "orderId": "4b94...",
  "correlationId": "d80d..."
}
```

---

# Architecture

```text
                Client

                  │

           POST /orders

                  │

         OrdersController

                  │

           OrdersService

                  │

        OrdersRepository

                  │

             PostgreSQL

                  │

           QueueService

                  │

          payment.queue

                  │

          PaymentWorker

                  │

       Fake Stripe Adapter

                  │

        PaymentsRepository

                  │

       IntegrationLogRepository
```

---

# Sequence

## Step 1

Persist the Order.

Status:

```
PENDING
```

---

## Step 2

Publish a job.

Queue

```
payment.queue
```

Payload

```json
{
  "orderId": "...",
  "correlationId": "..."
}
```

---

## Step 3

PaymentWorker receives the job.

Validation:

- job exists
- job name is valid

---

## Step 4

Retrieve Order.

If Order does not exist:

```
throw Error
```

BullMQ retry policy handles the retry.

---

## Step 5

Update Order.

```
PAYMENT_PROCESSING
```

---

## Step 6

Call external provider.

Current implementation

```
Fake Stripe
```

Future implementations

- Stripe
- PayPal
- Adyen
- MercadoPago

---

## Step 7

Persist Payment.

Fields

- provider
- amount
- currency
- idempotencyKey
- externalPaymentId

Status

```
SUCCEEDED
```

---

## Step 8

Update Order.

```
PAYMENT_SUCCEEDED
```

---

## Step 9

Create IntegrationLog.

Store

- provider
- operation
- request
- response
- latency
- correlationId
- status

---

# Retry Strategy

BullMQ configuration

```text
Attempts: 3

Backoff:
Exponential

Initial Delay:
1000 ms
```

---

# Idempotency

The payment provider receives

```
idempotencyKey
```

If the same message is processed multiple times, only one payment should be created.

---

# Correlation

Every component propagates

```
correlationId
```

This allows searching logs across:

- API
- Queue
- Worker
- Payment Provider
- Database
- Integration Logs

---

# Failure Scenarios

| Scenario          | Expected Behavior             |
| ----------------- | ----------------------------- |
| Order not found   | Throw exception               |
| Queue unavailable | API returns error             |
| Provider timeout  | Retry                         |
| Provider error    | Retry                         |
| Duplicate message | Ignore because of idempotency |
| Unknown job       | Warning log                   |

---

# Future Improvements

- Real Stripe SDK
- Circuit Breaker
- Dead Letter Queue
- Prometheus Metrics
- Grafana Dashboard
- OpenTelemetry
- Distributed Tracing
- Webhooks
- Notifications
- Outbox Pattern

---

# Success Criteria

A successful execution produces:

- Order created
- Payment created
- Order updated
- Integration Log stored
- Same correlationId propagated across the entire flow

```
Order
    ↓

Payment
    ↓

IntegrationLog
```
