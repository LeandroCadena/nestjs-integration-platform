# ADR-001

## Title

Repository Pattern

## Status

Accepted

## Context

The application must persist data while remaining independent from the persistence implementation.

## Decision

Repositories expose interfaces consumed by the application layer.

Concrete implementations use Prisma internally.

## Consequences

### Positive

- Easier testing
- Better separation of concerns
- Infrastructure can change without affecting business logic

### Negative

- Additional boilerplate
