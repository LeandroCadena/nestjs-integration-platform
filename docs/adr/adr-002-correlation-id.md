# ADR-002

## Title

Correlation ID

## Status

Accepted

## Context

The platform processes a single business operation across API, database, queue, worker and external provider layers.

Debugging this flow requires a shared identifier.

## Decision

Generate a `correlationId` when an order is created and propagate it through the full processing flow.

## Consequences

### Positive

- Easier debugging
- Better traceability
- Logs can be linked across components
- Prepares the system for distributed tracing

### Negative

- Every async payload must include the correlation ID
