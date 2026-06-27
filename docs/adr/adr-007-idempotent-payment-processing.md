# ADR-007

## Title

Idempotent Payment Processing

## Status

Accepted

## Context

Payment jobs can be retried or duplicated.

If the worker processes the same payment job more than once, the system could create duplicated payment records and simulate duplicated provider charges.

## Decision

Use the order `idempotencyKey` to ensure that a payment is created only once.

Before calling the payment provider, the worker must check whether a payment already exists for the same `idempotencyKey`.

If a payment exists, the worker finishes successfully without calling the provider again.

## Consequences

### Positive

- Prevents duplicated payments.
- Makes retries safer.
- Improves reliability.
- Aligns with real payment provider patterns.

### Negative

- Adds one additional database lookup.
- Requires unique idempotency keys.
- Requires careful handling if a payment is stuck in a pending state.
