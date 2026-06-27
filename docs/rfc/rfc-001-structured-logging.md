# RFC-001: Structured Logging

## Status

Accepted

## Problem

The platform processes operations across API, database, queue, worker and external provider layers.

Plain text logs are not enough to debug distributed flows, retries, provider failures or performance issues.

## Goals

- Emit structured JSON logs.
- Include `requestId` for each HTTP request.
- Include `correlationId` for business operations.
- Include contextual fields such as `orderId`, `jobId`, `provider` and `durationMs`.
- Prepare logs for future observability tools such as Grafana Loki, CloudWatch, Elastic or Datadog.

## Non-Goals

- Implement distributed tracing in this sprint.
- Add OpenTelemetry in this sprint.
- Add Grafana dashboards in this sprint.

## Options Considered

### NestJS Logger

Pros:

- Built-in.
- Simple.
- No extra dependency.

Cons:

- Less suitable for structured observability.
- Harder to query in log aggregation systems.

### Winston

Pros:

- Mature.
- Highly configurable.
- Multiple transports.

Cons:

- More complex.
- Slower than Pino in many Node.js workloads.
- More configuration overhead.

### Pino

Pros:

- Fast.
- JSON-first.
- Low overhead.
- Good NestJS integration through `nestjs-pino`.
- Works well with production log pipelines.

Cons:

- Raw JSON logs are less readable locally without pretty printing.

## Decision

Use `nestjs-pino` as the application logger.

## Evaluation

| Criteria                       | Result             |
| ------------------------------ | ------------------ |
| Solves a real problem          | Yes                |
| Alternative without dependency | Yes, NestJS Logger |
| Standard in Node.js ecosystem  | Yes                |
| Adds complexity                | Low                |
| Supports future observability  | High               |
| Production suitable            | Yes                |

## Expected Log Shape

```json
{
  "level": "info",
  "time": "2026-06-27T17:05:12.000Z",
  "service": "nestjs-integration-platform",
  "requestId": "req_123",
  "correlationId": "corr_456",
  "orderId": "ord_789",
  "jobId": "42",
  "provider": "fake-stripe",
  "durationMs": 328,
  "msg": "Payment processed successfully"
}
```

## Consequences

### Positive

- Better debugging.
- Better production readiness.
- Easier log aggregation.
- Consistent structure across API and workers.

### Negative

- Adds one dependency.
- Requires logger conventions across the codebase.
