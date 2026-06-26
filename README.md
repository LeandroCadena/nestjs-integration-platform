# NestJS Integration Platform

Production-ready backend integration platform built with NestJS, PostgreSQL, Redis, BullMQ, Prisma, Prometheus and Grafana.

## Goals

This project demonstrates:

- REST APIs with NestJS
- Event-driven processing with queues and workers
- Third-party SaaS integration simulation
- Retries, idempotency and dead-letter handling
- JWT and API key authentication
- Structured logging
- Metrics and observability
- Production-oriented backend architecture

## Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- Redis
- BullMQ
- Prometheus
- Grafana
- Docker Compose
- Jest
- ESLint
- Prettier

## Current Features

- Project setup
- Docker infrastructure
- PostgreSQL
- Redis
- Prisma

## Roadmap

- Orders API
- Payment Worker
- Webhooks
- Metrics
- Authentication
- OAuth2
- Dashboard

## Local Setup

```bash
npm install
docker compose up -d
npx prisma migrate dev
npm run start:dev
```
