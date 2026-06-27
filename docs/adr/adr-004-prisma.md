# ADR-004

## Title

Prisma ORM

## Status

Accepted

## Context

The platform requires relational persistence with PostgreSQL and type-safe database access from TypeScript.

## Decision

Use Prisma 6 with PostgreSQL and the standard `@prisma/client` import.

## Consequences

### Positive

- Type-safe database access
- Strong TypeScript integration
- Simple migrations
- Good developer experience

### Negative

- Adds ORM abstraction
- Complex queries may require raw SQL
