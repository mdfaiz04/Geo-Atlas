# Darukaa.Earth

A geospatial analytics platform for carbon and biodiversity projects. Administrators create
projects, draw their sites as polygons on a map, and read how each site performs over time.

| | |
| --- | --- |
| **Live demo** | _added when the Vercel deployment is provisioned_ |
| **Stack** | React 18 · Mapbox GL JS · Highcharts · FastAPI · PostgreSQL + PostGIS |
| **CI/CD** | GitHub Actions → Vercel |

---

## Contents

- [Architecture](#architecture)
- [Database schema](#database-schema)
- [Project structure](#project-structure)
- [Running locally](#running-locally)
- [CI/CD pipeline](#cicd-pipeline)
- [Code quality enforcement](#code-quality-enforcement)
- [Technical decisions and trade-offs](#technical-decisions-and-trade-offs)
- [Delivery phases](#delivery-phases)

---

## Architecture

The system is a monorepo holding two independently deployable applications and one managed
database.

```
Browser
   │
   ▼
React SPA (Vercel static hosting)
   │  JSON over HTTPS, JWT bearer token
   ▼
FastAPI (Vercel Python serverless function)
   │  SQLAlchemy 2.0 + GeoAlchemy2
   ▼
PostgreSQL 16 + PostGIS 3.4 (Neon, pooled connection)
```

### Backend layering

The API follows clean architecture. Dependencies point inward, so the business rules never import
a framework or a database driver.

```
src/api             HTTP concerns: routers, request/response schemas, dependency wiring
   │                (depends on application)
src/application     Use cases, commands and results, ports for hashing and tokens
   │                (depends on domain)
src/domain          Entities, repository contracts, domain errors — zero third-party imports
   ▲
src/infrastructure  SQLAlchemy models, repository implementations, bcrypt, JWT, settings
                    (implements the domain and application contracts)
```

The practical effect: `RegisterUser` is handed a `UserRepository`, a `PasswordHasher` and a
`TokenIssuer`. It has no idea that Postgres, bcrypt or PyJWT exist, so it is testable in isolation
and the storage engine can change without touching business logic.

### Frontend layering

```
src/app         Providers, router, protected routes, application shell
src/features    One folder per feature (auth, dashboard), each with api / components / pages
src/shared      HTTP client, token storage, configuration, UI primitives, design tokens
```

Features never import each other. Anything two features would share moves into `src/shared`.

---

## Database schema

Four tables. `sites.geom` is a real PostGIS geometry, not a pair of floats.

### `users`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `email` | `varchar(320)` | unique, indexed |
| `full_name` | `varchar(120)` | |
| `password_hash` | `varchar(128)` | bcrypt digest |
| `created_at` | `timestamptz` | server default `now()` |

### `projects`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `owner_id` | `uuid` | → `users.id`, `ON DELETE CASCADE`, indexed |
| `name` | `varchar(160)` | |
| `description` | `text` | nullable |
| `project_type` | `varchar(32)` | `carbon` or `biodiversity` |
| `status` | `varchar(32)` | defaults to `active` |
| `created_at` / `updated_at` | `timestamptz` | |

### `sites`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `project_id` | `uuid` | → `projects.id`, `ON DELETE CASCADE`, indexed |
| `name` | `varchar(160)` | |
| `geom` | `geometry(Polygon, 4326)` | **GIST index** `idx_sites_geom` |
| `area_hectares` | `numeric(14,4)` | computed from the polygon |
| `created_at` | `timestamptz` | |

### `site_metrics`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `site_id` | `uuid` | → `sites.id`, `ON DELETE CASCADE` |
| `metric_type` | `varchar(50)` | e.g. `carbon_stock`, `canopy_cover` |
| `recorded_at` | `date` | |
| `value` | `numeric(14,4)` | |
| `unit` | `varchar(20)` | |

Composite index `ix_site_metrics_series (site_id, metric_type, recorded_at)` serves the time-series
queries behind the site analytics charts — one index covering filter and sort.

**Why SRID 4326:** it is the coordinate system Mapbox emits, so polygons are stored exactly as
drawn with no reprojection. Area is computed by casting to `geography`, which returns true square
metres rather than degrees.

---

## Project structure

```
darukaa-earth/
├── .github/workflows/     ci.yml (quality gates) and deploy.yml (production release)
├── .husky/                pre-commit and commit-msg hooks
├── backend/
│   ├── alembic/           migration environment and versioned migrations
│   ├── api/index.py       Vercel serverless entry point
│   ├── src/               domain · application · infrastructure · api
│   └── tests/             pytest suite running against real PostGIS
├── frontend/
│   ├── src/               app · features · shared
│   └── tests/             vitest component and client tests
├── scripts/               tooling helpers used by the commit hooks
├── docker-compose.yml     local PostgreSQL + PostGIS
└── lint-staged.config.mjs routes staged files to the right linter
```

---

## Running locally

### Prerequisites

Docker, Node.js 20+, Python 3.12, Git.

### 1. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL 16 with PostGIS 3.4 on `localhost:5432` (user, password and database are all
`darukaa`).

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate        # Windows
source .venv/bin/activate     # macOS and Linux

pip install -r requirements-dev.txt
cp .env.example .env          # then set JWT_SECRET_KEY to 32+ characters
alembic upgrade head
uvicorn src.main:app --reload --port 8000
```

API: <http://localhost:8000> · interactive docs: <http://localhost:8000/docs>

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

App: <http://localhost:5173>

### 4. Commit hooks

Run once from the repository root so Husky installs its hooks:

```bash
npm install
```

### Test suites

```bash
cd backend  && pytest                    # 11 tests against real PostGIS
cd frontend && npm run test              # component and HTTP client tests
```

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | backend | Postgres connection string (`postgres://` is normalised automatically) |
| `JWT_SECRET_KEY` | backend | token signing key, minimum 32 characters (enforced at startup) |
| `CORS_ORIGINS` | backend | comma-separated list of allowed browser origins |
| `ENVIRONMENT` | backend | `development`, `test` or `production` |
| `VITE_API_BASE_URL` | frontend | base URL of the API |

---

## CI/CD pipeline

Two workflows, deliberately separated so that **a deployment cannot happen unless every check has
already passed**.

### `ci.yml` — runs on every push and pull request to `main`

| Job | What it enforces |
| --- | --- |
| `repo-format` | Prettier formatting across the whole repository |
| `backend-quality` | Ruff lint, Ruff format check, mypy type checking |
| `backend-tests` | pytest against a live `postgis/postgis:16-3.4` service container, with coverage |
| `frontend-quality` | ESLint and TypeScript `--noEmit` |
| `frontend-tests` | Vitest suite followed by a production Vite build |

All five jobs run in parallel. `concurrency` cancels superseded runs so a fast follow-up push does
not queue behind stale work. Dependency caching (pip and npm) keeps the pipeline short.

The backend test job is the important one: it spins up **real PostGIS**, applies the Alembic
migrations and runs the suite against them. Migrations are therefore tested on every commit rather
than discovered to be broken at deploy time.

### `deploy.yml` — runs only after CI succeeds on `main`

Triggered by `workflow_run`, gated on `conclusion == 'success'`:

1. **`migrate`** — applies `alembic upgrade head` to the production database.
2. **`deploy-api`** — builds and promotes the FastAPI serverless function on Vercel.
3. **`deploy-web`** — builds and promotes the React app on Vercel.

The jobs are sequential on purpose: the schema is always ahead of the code that reads it, and the
frontend only goes live once the API it talks to is already deployed.

Vercel's own Git integration is **disabled** (`"git": { "deploymentEnabled": false }` in both
`vercel.json` files). Left on, Vercel would deploy every push including ones with failing tests,
which would defeat the purpose of the pipeline.

### Required repository secrets

| Secret | Used by |
| --- | --- |
| `VERCEL_TOKEN`, `VERCEL_ORG_ID` | both deploy jobs |
| `VERCEL_PROJECT_ID_API`, `VERCEL_PROJECT_ID_WEB` | the matching deploy job |
| `DATABASE_URL`, `JWT_SECRET_KEY` | the migration job |

---

## Code quality enforcement

Quality is enforced at the moment of commit, not discovered later in review.

| Hook | Tool | Effect |
| --- | --- | --- |
| `pre-commit` | lint-staged | routes each staged file to the linter that owns its stack |
| `commit-msg` | commitlint | rejects messages that are not Conventional Commits |

`lint-staged.config.mjs` maps file patterns to commands:

| Pattern | Commands |
| --- | --- |
| `frontend/src/**/*.{ts,tsx}` | ESLint `--fix --max-warnings 0`, then Prettier |
| `*.{js,cjs,mjs,json,css,yml,yaml}` | Prettier |
| `backend/**/*.py` | Ruff lint `--fix`, then Ruff format |

Husky is a Node tool and Python is not a Node stack, so `scripts/lint-python.mjs` bridges the gap:
it resolves Ruff from `backend/.venv` when present, falls back to `PATH`, and **fails the commit
with a clear message** if Ruff is missing entirely. One gate therefore covers both languages.

These hooks are not decorative — during development a commit was correctly rejected for a
101-character line in a migration file, and the commit only went through after the code was fixed.
To see it yourself, break formatting in any tracked file and try to commit.

**Why Ruff instead of Black plus isort plus flake8:** Ruff replaces all three, and its formatter is
Black-compatible. One tool means one configuration, no risk of two formatters disagreeing, and a
pre-commit hook that finishes in milliseconds rather than seconds.

---

## Technical decisions and trade-offs

**FastAPI over Django and Flask.** The product is a JSON API with no server-rendered pages, so
Django's admin, templating and ORM are weight without benefit. Flask would need the same pieces
assembled by hand. FastAPI provides Pydantic validation at the boundary and generates the OpenAPI
documentation at `/docs` for free, which is genuine reviewer-facing value.

**PostGIS rather than latitude/longitude columns.** Sites are polygons. Storing them as geometry
gives real containment and intersection queries, a GIST index, and accurate area in hectares
computed by the database. Doing this in application code would be slower and less correct.

**Everything on Vercel, database on Neon.** Running FastAPI as a serverless function has real
costs: a cold start of roughly one to two seconds after idle, and no long-lived connection pool.
Both are handled explicitly — dependencies are kept lean, and SQLAlchemy uses `NullPool` against
Neon's pooled connection string so short-lived function instances cannot exhaust Postgres
connections. In exchange the entire stack lives on one platform with one deployment model. Neon
was chosen over the platform's own free Postgres because free databases elsewhere expire after
thirty days, and a demo URL has to still work weeks after submission.

**UUID primary keys.** Slightly larger than integers, but identifiers can be generated by the
application without a database round trip and never leak how many records exist.

**Sync SQLAlchemy with `def` endpoints.** FastAPI runs synchronous endpoints in a threadpool, so
the database driver never blocks the event loop. Async SQLAlchemy would add complexity for no
measurable gain at this scale.

**Tests run against real PostGIS, not SQLite.** SQLite has no geometry type, so a test suite using
it would prove nothing about the part of the system most likely to break.

**Local Python is 3.13, CI and production are pinned to 3.12.** Vercel's Python runtime targets
3.12, so CI is the authority on compatibility and runs the same version production does.

**No path filtering in CI.** Every job runs on every change. For a repository this size the whole
pipeline finishes in about two minutes, and running everything removes any chance of a change
slipping through because a filter was slightly wrong.

---

## Delivery phases

**Phase 1 — foundation and pipeline (complete).** Monorepo, commit hooks, CI, clean-architecture
FastAPI service, PostGIS schema and migrations, JWT authentication, React shell with sign-in and
sign-up, deployment pipeline.

**Phase 2 — core product.** Project CRUD, Mapbox GL JS map with polygon drawing, sites persisted as
PostGIS geometry, portfolio map view.

**Phase 3 — analytics and polish.** Site detail screen with Highcharts time series, seeded dataset
with documented provenance, UI refinement, final documentation.

### Enabling deployment

The deploy workflow stays dormant until the repository variable `DEPLOY_ENABLED` is set to `true`
(**Settings → Secrets and variables → Actions → Variables**). Until then CI still runs on every
push, and the release pipeline is simply skipped rather than failing on missing credentials. Set
the six secrets listed above first, then flip the variable.
