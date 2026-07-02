# Premium Dating Marketplace

Next.js full-stack app migrated from the Figma Make prototype. The original design is at [Premium Dating Marketplace (Figma)](https://www.figma.com/design/saCesBziZLoUALoRdxtQxr/Premium-Dating-Marketplace).

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **PostgreSQL** + **Prisma 6**
- **NextAuth.js v5** (JWT sessions, HTTP-only cookies)
- **Tailwind CSS 4**
- **TypeScript**

## Getting started

```bash
npm install
cp .env.example .env
# Edit .env — set DATABASE_URL and AUTH_SECRET (openssl rand -base64 32)
# Start PostgreSQL (see Database setup below), then:
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database setup

### Option A — Docker (recommended)

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with database `global_dating`.

### Option B — Local PostgreSQL

Create a database and set `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/global_dating?schema=public"
```

### Apply schema and seed

```bash
npm run db:migrate   # create tables (dev)
npm run db:seed      # load demo data
```

Other useful commands:

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema without migration files |
| `npm run db:studio` | Open Prisma Studio GUI |

## Authentication

Sessions use **NextAuth.js v5** with:

- **Credentials provider** — email + password verified against PostgreSQL (bcrypt)
- **JWT strategy** — role and user id stored in signed token
- **HTTP-only cookies** — `authjs.session-token` (not accessible to JavaScript)
- **Middleware** — protects `/admin`, `/dashboard/male`, `/dashboard/female` by role

### Auth files

| File | Purpose |
|------|---------|
| `auth.ts` | NextAuth handlers + Credentials authorize (Prisma) |
| `auth.config.ts` | Edge-safe config (middleware + session callbacks) |
| `middleware.ts` | Route protection by role |
| `lib/auth-server.ts` | Server-side `auth()` helpers for API routes |

### Demo credentials (after seed)

| Email | Password | Role |
|-------|----------|------|
| `admin@aurum-private.com` | `password123` | Admin |
| `female@aurum-private.com` | `password123` | Female |
| `j.keller@email.com` | `password123` | Male (Premium) |

## API routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth session endpoints |
| `/api/health` | GET | Health + DB connectivity check |
| `/api/profiles` | GET, POST | List/create profiles (DB) |
| `/api/auth/register` | POST | Register new user + membership |
| `/api/contact` | POST | Save contact message to DB |

## Project structure

```
app/                  # Next.js routes and API handlers
  api/                # Backend API routes (Prisma-backed)
prisma/
  schema.prisma       # Database schema
  seed.ts             # Demo data seeder
auth.ts               # NextAuth config (Credentials + Prisma)
auth.config.ts        # Edge-safe auth config for middleware
lib/
  prisma.ts           # Prisma client singleton
  auth-server.ts      # Server-side session helpers
  db/                 # Query helpers and mappers
components/
  site/               # UI pages migrated from Figma prototype
  providers/          # Session + modal context
```

| Model | Purpose |
|-------|---------|
| `User` | Accounts (male, female, admin) |
| `FemaleProfile` | Public female member profiles |
| `Membership` | Male subscription plans |
| `ConnectionRequest` | Introduction requests |
| `ProfileApproval` | Pending profile verification queue |
| `ContactMessage` | Contact form submissions |
| `PlanConfig` | Bronze / Premium / Elite plan settings |
| `BillingRecord` | Membership payment history |

## Next steps

1. Wire browse/dashboard UI to `/api/profiles` instead of `lib/mock-data.ts`
2. Integrate Stripe for payments
3. Split `components/site/app-pages.tsx` into smaller modules
4. Add OAuth providers (Google, Apple) via NextAuth if needed
