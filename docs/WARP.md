# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Concert Ticket Booking System - A full-stack application with NestJS backend and Next.js 14 frontend using the App Router. Users can browse and reserve concert tickets (one per concert), while admins manage concerts and view reservation history.

## Tech Stack

**Backend:** NestJS + TypeORM + Mongodb + JWT authentication  
**Frontend:** Next.js 14 (App Router) + Tailwind CSS 3.4.3 + Axios  
**Deployment:** Vercel (per project rules)

## Development Commands

### Backend (NestJS)
```bash
cd backend

# Development
npm run start:dev          # Start with hot-reload on port 3001
npm run start:debug        # Start with debugger
npm run build              # Production build
npm run start:prod         # Run production build

# Testing
npm test                   # Run all unit tests
npm test -- <filename>     # Run specific test file (e.g., npm test -- users.service.spec.ts)
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage report

# Code Quality
npm run lint               # ESLint with auto-fix
npm run format             # Prettier formatting

# Database
npm run migration:generate -- src/migrations/<MigrationName>  # Generate migration from entity changes
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
```

### Frontend (Next.js)
```bash
cd frontend

# Development
npm run dev                # Start dev server on port 3000
npm run build              # Production build
npm run start              # Run production build
npm run lint               # Next.js linting
```

## Architecture & Code Structure

### Backend Module Organization
NestJS follows a modular architecture. Each feature has its own module folder in `backend/src/`:

- **users/** - User entity, authentication-related services
- **concerts/** - Concert management (CRUD operations)
  - `dto/` - Data Transfer Objects for validation
  - `entities/` - TypeORM entity definitions
- **reservations/** - Ticket reservation logic with concurrency handling
  - `entities/` - Reservation entity with status enum (active/cancelled)
- **config/** - TypeORM DataSource configuration for migrations

**Key files:**
- `app.module.ts` - Root module that imports all feature modules and configures TypeORM globally
- `main.ts` - Application bootstrap with global validation pipes, CORS, and `/api` prefix

### Frontend Structure
Next.js 14 uses the App Router pattern (`frontend/app/`):

- `app/page.tsx` - User concert listing and reservation interface
- `app/admin/` - Admin-only routes
  - `page.tsx` - Admin dashboard
  - `create/page.tsx` - Create new concerts
  - `edit/[id]/page.tsx` - Edit concert details
  - `history/page.tsx` - View all reservations
- `lib/` - Shared utilities
  - `api.ts` - Axios client with API endpoint functions (`concertApi`, `reservationApi`)
  - `types.ts` - TypeScript interfaces matching backend entities
  - `utils.ts` - Helper functions

### Database Schema
The system uses three main entities with TypeORM:
- **Concert** - name, description, totalSeats, availableSeats (tracked for reservations)
- **Reservation** - links User to Concert with status enum (active/cancelled)
- **User** - email, name, password (hashed), role (admin/user)

**Important:** Entities use `@Exclude()` on sensitive fields (password) and UUID primary keys.

### API Communication
All API endpoints are prefixed with `/api` (configured in `backend/src/main.ts`):
- Authentication: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`
- Concerts: `/api/concerts` (GET all, POST create [admin], GET/:id, DELETE/:id [admin])
- Reservations: `/api/reservations` (GET all [admin], `/my` for user's own), POST create, PATCH/:id/cancel

Frontend uses centralized API client in `lib/api.ts` with axios instance.

## Environment Setup

### Backend (.env)
Copy `.env.example` to `.env` and configure:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=<your_password>
DATABASE_NAME=concert_booking
JWT_SECRET=<generate_secure_secret>
JWT_EXPIRATION=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**First-time setup:**
1. Create Mongodb database: `CREATE DATABASE concert_booking;`
2. Run migrations: `npm run migration:run`

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Development Practices

### Validation
- Backend uses `class-validator` with DTOs. Global ValidationPipe in `main.ts` automatically validates all requests
- Always define DTOs in module `dto/` folders with validation decorators
- Frontend should handle validation errors from backend (400 status responses)

### Concurrency & Race Conditions
The README documents an important pattern for handling concurrent ticket reservations (lines 268-329):
- Use TypeORM transactions with pessimistic locking (`setLock('pessimistic_write')`)
- Check available seats within the transaction before creating reservation
- Atomically decrement `availableSeats` and create reservation in same transaction
- Prevents overselling when multiple users reserve simultaneously

When working on reservation logic, always ensure atomic operations to prevent race conditions.

### Authentication
JWT-based authentication with `@nestjs/jwt` and `@nestjs/passport`. Passwords hashed with bcrypt. Auth module implementation may be incomplete - check `app.module.ts` imports.

### Testing
Backend tests use Jest configured in `package.json`. Test files should be named `*.spec.ts` and placed alongside source files (NestJS convention). As of now, test files may not be implemented yet.

## Tailwind CSS Configuration
Custom color palette defined in `tailwind.config.ts`:
- `primary.blue`: #1E88E5
- `primary.green`: #26A69A  
- `primary.red`: #E57373

**Note:** Project rules specify using Tailwind CSS version 4.1, but current package.json shows 3.4.3. When upgrading or adding Tailwind features, target version 4.1.

## Deployment
Use Vercel for deployment (per project rules). Frontend is a Next.js app optimized for Vercel with `next.config.js` already configured.
