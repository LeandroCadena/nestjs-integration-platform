# Engineering Standards

This document defines the engineering conventions used throughout the project.

---

# General Principles

- Production-first mindset.
- Business-driven architecture.
- Framework-agnostic business logic.
- Strong typing.
- Documentation before implementation.

---

# Project Structure

Each module should contain:

```
controller
service
dto
interfaces
repositories
module
```

Infrastructure-specific code must remain inside repositories or adapters.

---

# Dependency Injection

Always depend on interfaces or injection tokens.

Business services must never instantiate dependencies directly.

Correct:

```
OrdersService
        │
        ▼
OrdersRepository (interface)
        │
        ▼
PrismaOrdersRepository
```

---

# Repository Pattern

Services must never access Prisma directly.

Only repositories are allowed to interact with the database.

---

# DTO

DTOs are responsible only for:

- Validation
- Serialization
- Transformation

No business logic.

---

# Logging

Use Pino.

Never use console.log().

Every important operation should include:

- correlationId
- requestId (when available)
- orderId (when available)
- provider (when available)

---

# Error Handling

Errors should propagate to a global exception filter.

Business logic should throw domain exceptions.

Controllers should not catch business exceptions.

---

# Correlation ID

Every business operation must have a correlationId.

It must travel through:

API

↓

Queue

↓

Worker

↓

Provider

↓

Logs

↓

Database

---

# Commits

Use Conventional Commits.

Examples:

```
feat:
fix:
docs:
refactor:
test:
perf:
ci:
chore:
```

---

# Pull Requests

Every feature should include:

- Documentation
- Tests (when applicable)
- Lint
- Successful build

---

# ADR

Architecture changes require an ADR.

---

# RFC

Large features should start with an RFC.

---

# TypeScript

Rules:

- strict
- no any
- no eslint-disable unless justified
- prefer readonly
- prefer explicit types
- use interfaces for contracts

---

# Testing

Future standard:

- Unit Tests
- Integration Tests
- End-to-End Tests
