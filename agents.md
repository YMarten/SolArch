# SolArch — Agents Guide

## Project Overview

SolArch is an enterprise solution architecture management tool. It allows architecture teams to maintain an inventory of solutions, map business domains and capabilities, track architectural reviews, and visualize ecosystem dependencies.

The project is split into two independent services:

- **solarch-api** — REST API backend (Fastify + Prisma 7 + PostgreSQL)
- **solarch-web** — Frontend application (Next.js 14 + Mantine)

Both services are containerized with Docker and orchestrated via `docker-compose.yml` at the root.

---

## Repository Structure

```
solarch/
  docker-compose.yml          # Orchestrates db, api, and web services
  solarch-api/                # Backend
    src/
      index.ts                # Server entry point, plugin registration, route mounting
      prisma.ts               # Prisma client singleton with PrismaPg adapter
      routes/                 # HTTP route handlers (one file per entity)
        solutions.route.ts
        technologies.route.ts
        domains.route.ts
        areas.route.ts
        capabilities.route.ts
        connections.route.ts
        attachments.route.ts
        environments.route.ts
        reviews.route.ts
      services/               # Business logic and Prisma queries (one file per entity)
        solutions.service.ts
        technologies.service.ts
        domains.service.ts
        areas.service.ts
        capabilities.service.ts
        connections.service.ts
        attachments.service.ts
        environments.service.ts
        reviews.service.ts
      types/                  # TypeScript DTOs (one file per entity)
        solution.types.ts
        technology.types.ts
        domain.types.ts
        area.types.ts
        capability.types.ts
        connection.types.ts
        attachment.types.ts
        environment.types.ts
        review.types.ts
      tests/
        api.test.ts           # Integration test — hits all endpoints end-to-end
    prisma/
      schema.prisma           # Single source of truth for the database model
      migrations/             # Auto-generated migration files
    prisma.config.ts          # Prisma 7 config — datasource URL, migration path
    Dockerfile
  solarch-web/                # Frontend
    app/                      # Next.js App Router pages
      solutions/              # Catalog, detail, new, edit
      ecosystem/              # D3 dependency graph
      capabilities/           # Business capability heat map
      reviews/                # Global reviews and pending actions
      catalog/                # Reference data catalogs (technologies, domains, areas, capabilities)
    components/
      layout/                 # AppShell, Sidebar, Header
      solutions/              # SolutionCard, SolutionForm, SolutionDetail, SolutionConnections, etc.
      reviews/                # ReviewForm, ReviewsList, ReviewDetail, GlobalReviewsList
      ecosystem/              # EcosystemGraph (D3)
      capabilities/           # CapabilityMap (heat map)
      catalog/                # TechnologiesTable, DomainsTable, AreasTable, CapabilitiesTable, CatalogModal
      ui/                     # StatusBadge, CriticalityBadge
    services/                 # HTTP client wrappers — one per entity, uses lib/api.ts
    types/                    # TypeScript interfaces mirroring backend DTOs
    lib/
      api.ts                  # Base fetch client with error handling (api.get/post/put/patch/delete)
    Dockerfile
```

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Backend framework | Fastify | With @fastify/cors and @fastify/helmet |
| ORM | Prisma 7 | Uses @prisma/adapter-pg — no internal engine |
| Database | PostgreSQL 16 | Runs as Docker service `solarch-db` |
| Frontend framework | Next.js 14 | App Router, all pages are Client Components |
| UI library | Mantine | With @mantine/form, @mantine/hooks, @mantine/dates, @mantine/notifications |
| Icons | @tabler/icons-react | |
| Graph visualization | D3.js | Force-directed graph in EcosystemGraph.tsx |
| Language | TypeScript | Strict mode on both projects |
| Containerization | Docker + Docker Compose | Three services: db, api, web |

---

## Data Model

The database has 16 models and 12 enums. `Solution` is the central entity.

**Core entities:**
- `Solution` — the main inventory record. Fields: name, description, version, status, type, role, criticality, origin, vendor, owner, techOwner, repoUrl, lastDeploy, tags
- `Technology` — catalog of technologies used by solutions (M:N via `TechnologyOnSolution`)
- `BusinessDomain` — functional business grouping. Hierarchical via `parentId`
- `BusinessCapability` — specific capability within a domain. Hierarchical via `parentId` (M:N via `CapabilityOnSolution`)
- `BusinessArea` — organizational unit responsible for a solution (M:N via `AreaOnSolution`)
- `Connection` — typed dependency between two solutions. Fields: fromId, toId, type (REST/GRAPHQL/EVENT/SHARED_DB/FILE/WEBHOOK/GRPC/OTHER), description
- `Attachment` — categorized URL linked to a solution. Categories: DIAGRAM/FUNCTIONAL_DOC/TECHNICAL_DOC/RUNBOOK/ADR/API_CONTRACT/OTHER
- `Environment` — deployment environment per solution (DEV/QA/STAGING/PROD)
- `ArchReview` — architectural review of a solution. Has child `ReviewDimension[]` and `ReviewAction[]`
- `ChangeLog` — automatic audit log of changes to a solution

**Key enums:**
- `SolutionRole`: CORE_TRANSACTIONAL | SATELLITE | INTEGRATION | DATA_ANALYTICS | INTERACTION_CHANNEL
- `SolutionStatus`: ACTIVE | DEPRECATED | IN_SUBSTITUTION | IN_DEVELOPMENT | MAINTENANCE
- `SolutionOrigin`: INTERNAL | EXTERNAL | CUSTOM_THIRD
- `ReviewResult`: COMPLIANT | COMPLIANT_WITH_NOTES | NON_COMPLIANT | IN_REVIEW

---

## API Endpoints

All endpoints are prefixed. The backend runs on port 3001.

```
GET    /health

GET    /api/solutions
POST   /api/solutions
GET    /api/solutions/:id
PUT    /api/solutions/:id
DELETE /api/solutions/:id

GET    /api/technologies
POST   /api/technologies
GET    /api/technologies/:id
PUT    /api/technologies/:id
DELETE /api/technologies/:id

GET    /api/domains
POST   /api/domains
GET    /api/domains/:id
PUT    /api/domains/:id
DELETE /api/domains/:id

GET    /api/areas
POST   /api/areas
GET    /api/areas/:id
PUT    /api/areas/:id
DELETE /api/areas/:id

GET    /api/capabilities
POST   /api/capabilities
GET    /api/capabilities/:id
PUT    /api/capabilities/:id
DELETE /api/capabilities/:id

GET    /api/connections?solutionId=
POST   /api/connections
GET    /api/connections/:id
PUT    /api/connections/:id
DELETE /api/connections/:id

GET    /api/attachments?solutionId=
POST   /api/attachments
GET    /api/attachments/:id
PUT    /api/attachments/:id
DELETE /api/attachments/:id

GET    /api/environments?solutionId=
POST   /api/environments
GET    /api/environments/:id
PUT    /api/environments/:id
DELETE /api/environments/:id

GET    /api/reviews?solutionId=
GET    /api/reviews/actions/pending
GET    /api/reviews/:id
POST   /api/reviews
PUT    /api/reviews/:id
DELETE /api/reviews/:id
PATCH  /api/reviews/actions/:actionId
```

---

## Architecture Patterns

**Backend route → service separation**
Routes only receive requests, validate types, call the service, and return responses. All Prisma queries and business logic live in the service layer. Never add Prisma calls directly in route handlers.

**Frontend service layer**
All API calls go through `lib/api.ts` which centralizes error handling and base URL configuration. Component files import from `services/` not from `lib/api.ts` directly. Never call `fetch()` directly in components.

**Prisma relations**
All M:N relations use explicit junction models (`TechnologyOnSolution`, `DomainOnSolution`, etc.) instead of Prisma's implicit M:N. This allows adding fields to the relation later (e.g. version on TechnologyOnSolution).

**Client Components only**
All Next.js pages are Client Components (`"use client"`) that fetch data in `useEffect`. This avoids prerender errors during Docker build when the API is not available at build time.

---

## Environment Variables

**solarch-api `.env`**
```env
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/solarch?schema=public"
PORT=3001
```

**solarch-web `.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

When running with Docker Compose, the API service uses:
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/solarch?schema=public
```
Note: the host is `db` (the Docker Compose service name) not `localhost`.

---

## Running the Project

**Local development (without Docker)**
```bash
# Terminal 1 — backend
cd solarch-api
npm run dev       # runs ts-node src/index.ts on port 3001

# Terminal 2 — frontend
cd solarch-web
npm run dev       # runs Next.js on port 3000
```

**With Docker**
```bash
# From the solarch/ root
docker compose up --build   # first time
docker compose up           # subsequent runs
```

**Database migrations**
```bash
cd solarch-api
npx prisma migrate dev --name <migration_name>   # development
npx prisma migrate deploy                         # production / Docker
npx prisma generate                               # regenerate client after schema changes
npx prisma studio                                 # visual DB browser on port 5555
```

**Run integration tests**
```bash
cd solarch-api
npm run test:api   # requires the server to be running in another terminal
```

---

## Adding a New Entity

Follow this checklist to add a new entity consistently:

1. Add the model and any enums to `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_<entity>`
3. Run `npx prisma generate`
4. Create `src/types/<entity>.types.ts` with CreateDTO and UpdateDTO
5. Create `src/services/<entity>.service.ts` with findAll, findById, create, update, remove
6. Create `src/routes/<entity>.route.ts` with GET/POST/PUT/DELETE handlers
7. Register the route in `src/index.ts`
8. Add the test cases to `src/tests/api.test.ts`
9. Create `types/<entity>.ts` in `solarch-web`
10. Create `services/<entity>.service.ts` in `solarch-web`
11. Build the UI components and pages

---

## Known Constraints

- Prisma 7 requires `prisma.config.ts` at the project root — the datasource URL is not in `schema.prisma`
- The Prisma client is generated to the default location — import from `@prisma/client`
- All Next.js pages are Client Components — Server Components that call the API will fail during Docker build because the API is not available at build time
- CORS is configured for `http://localhost:3000` only — update `src/index.ts` when deploying to a different domain
- The content type parser in `src/index.ts` handles empty bodies in DELETE requests — do not remove it
- D3 drag behavior requires `as unknown as` cast due to TypeScript type incompatibility with Mantine's BaseType

---

## Phase 2 Roadmap

- Authentication with Auth.js (Google / GitHub login)
- Role-based access control
- Repository integration — auto-fetch last deploy date from main branch
- Draw.io diagram embedding
- Notifications for upcoming architectural reviews
- PDF export of solution profiles
- Global search

---

# Que se necesita hacer ahora?

## Contexto del proyecto

Esta aplicación pertenece a la práctica de Arquitectura de Soluciones de Grupo Rica.

Actualmente se está trabajando la Línea de acción 4: Modernización y retiro de soluciones obsoletas. Su objetivo es evaluar las soluciones de terceros para determinar si deben mantenerse, actualizarse, modernizarse, reemplazarse o retirarse.

Ya se realizó un inventario inicial de 24 soluciones de terceros con su nombre y descripción. El siguiente paso es recopilar información sobre:

- Área responsable.
- Proceso soportado.
- Usuarios.
- Estado de uso.
- Criticidad.
- Proveedor y soporte.
- Versión y actualizaciones.
- Licenciamiento.
- Modalidad de alojamiento.
- Integraciones y dependencias.
- Problemas y riesgos.
- Iniciativas de sustitución o retiro.

## Objetivo de la revisión

Revisar la aplicación local SolArch y determinar si puede utilizarse para registrar, evaluar y dar seguimiento al inventario de soluciones de terceros.

Evaluar:

1. Arquitectura y tecnologías utilizadas.
2. Modelo de datos existente.
3. Funciones y pantallas disponibles.
4. Entidades relacionadas con aplicaciones o soluciones.
5. Capacidad para registrar los campos del levantamiento.
6. Capacidad para consultar, filtrar y exportar la información.
7. Funciones existentes que puedan reutilizarse.
8. Cambios requeridos para soportar la evaluación del portafolio.
9. Riesgos técnicos, limitaciones y deuda técnica.

## Restricciones

- Realizar inicialmente solo una revisión.
- No modificar archivos ni ejecutar migraciones.
- No eliminar ni sobrescribir información.
- Diferenciar claramente entre funciones existentes y mejoras propuestas.
- Presentar los hallazgos priorizados.