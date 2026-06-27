# ADR-005

## Title

Worker Architecture

## Status

Accepted

## Context

Payment processing should not run inside the HTTP request lifecycle because external providers can be slow, fail or timeout.

## Decision

Use a dedicated BullMQ worker to consume payment jobs from `payment.queue`.

The worker coordinates:

- loading the order,
- updating order status,
- calling the payment provider,
- creating the payment record,
- storing integration logs.

## Consequences

### Positive

- API remains fast
- Payment processing can retry independently
- Workers can scale horizontally
- External provider failures are isolated from the REST API

### Negative

- Requires queue monitoring
- Requires idempotency handling
- Debugging requires correlation IDs
