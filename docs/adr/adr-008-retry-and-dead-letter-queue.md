# ADR-008

## Title

Retry Strategy and Dead Letter Queue

## Status

Accepted

## Context

External providers can fail temporarily due to timeouts, rate limits or internal errors.

Payment jobs should retry automatically, but failed jobs must not disappear silently.

## Decision

Use BullMQ retry attempts with exponential backoff.

If all attempts fail, the job remains failed and will later be moved or inspected as part of a Dead Letter Queue workflow.

## Consequences

### Positive

- Temporary provider failures can recover automatically.
- Failed jobs remain visible.
- Improves operational reliability.

### Negative

- Requires monitoring failed jobs.
- Requires idempotency to avoid duplicate side effects.
