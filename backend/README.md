# RRHH backend

NestJS REST/WebSocket foundation with Prisma and PostgreSQL. The backend is independent of `frontend/` and the reserved `integracion/` directory.

## Setup

Requires Node.js 20.19+ and PostgreSQL 14+.

```powershell
cd backend
npm install
Copy-Item .env.example .env
# Set DATABASE_URL in .env to a database and account created locally.
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

The API base path is `/api/v1`; health check: `GET /api/v1/health`; Swagger: `/api/v1/docs`. Configure `FRONTEND_ORIGIN` with the exact browser origin (multiple origins may be comma-separated).

For deployment, run `npm run prisma:deploy` before `npm run start:prod`. Never commit `.env` or real credentials.

## Database

The Prisma schema is in `prisma/schema.prisma`; connection configuration for Prisma CLI is in `prisma.config.ts`. Its initial PostgreSQL migration is in `prisma/migrations/20261024160000_initial/`. UUID primary keys, explicit join models, foreign keys, timestamps, uniqueness constraints, and query indexes are defined there. Evolve the schema with new additive Prisma migrations; review any generated destructive SQL before applying it.

## Architecture and scope

`src/` is organized by business domain: authentication, users, employees, RBAC, organization structure, announcements, requests/approvals, chat, notifications, audit logs, shared services, and external integrations. CRUD route scaffolds return HTTP 501 until their services are implemented. WebSocket gateways currently define namespaces only; event contracts are centralized in `src/shared/realtime/`.

Authentication flows, permission enforcement, CRUD persistence, approval workflows, message delivery, notification processing, audit capture, and external-system adapters are intentionally not implemented. Do not treat the scaffolds as production authorization or event processing.
