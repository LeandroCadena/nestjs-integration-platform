# ADR-006

## Title

Structured Logging with Pino

## Status

Accepted

## Context

The platform uses asynchronous processing across REST APIs, queues, workers and external integrations.

Debugging these flows requires structured logs with consistent metadata.

## Decision

Use `nestjs-pino` to emit JSON structured logs.

Logs should include relevant context such as:

- requestId
- correlationId
- orderId
- jobId
- provider
- durationMs

## Consequences

### Positive

- Logs become machine-readable.
- Easier debugging across async flows.
- Compatible with production observability platforms.
- Better foundation for Grafana Loki, CloudWatch, Elastic or Datadog.

### Negative

- Adds a logging dependency.
- Requires consistent logging conventions.
