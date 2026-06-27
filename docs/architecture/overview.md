# Architecture Overview

The platform follows a modular monolithic architecture built with NestJS.

Business operations are processed asynchronously using BullMQ and Redis.

External providers are accessed through adapters, allowing the application to replace integrations without affecting the business layer.

## Core Components

- REST API
- PostgreSQL
- Redis
- BullMQ
- Workers
- External Providers
- Integration Logs

## Design Principles

- SOLID
- Dependency Injection
- Repository Pattern
- Event-driven Processing
- Correlation IDs
