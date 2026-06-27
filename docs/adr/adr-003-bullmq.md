# ADR-003

## Title

BullMQ for Asynchronous Processing

## Status

Accepted

## Context

Payment processing depends on external providers, which may be slow or temporarily unavailable.

Processing payments directly inside the HTTP request would make the API slower and less reliable.

## Decision

Use BullMQ with Redis to process payment jobs asynchronously.

## Consequences

### Positive

- Faster API response
- Retry support
- Worker scalability
- Backoff strategy
- Better separation between API and background processing

### Negative

- Requires Redis
- Adds operational complexity
- Requires monitoring queue health
