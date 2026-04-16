# SmilePro Dental Clinic - Dr. Ahmed Tarek

## Overview

A bilingual (Arabic + English) dental clinic portfolio and appointment booking website for Dr. Ahmed Tarek's SmilePro clinic in Cairo, Egypt.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Frontend**: React + Vite + TailwindCSS + Framer Motion + Radix UI
- **Build**: esbuild (CJS bundle)

## Features

- Bilingual (Arabic + English) with RTL/LTR toggle
- Dark/Light theme toggle
- Homepage with hero, services, stats, doctor profile, testimonials
- Appointment booking form with validation
- Admin dashboard to manage appointments and view stats
- Smooth animations and premium dental aesthetic

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Routes

- `/` — Homepage (hero, services, doctor profile, stats, testimonials, contact)
- `/book` — Appointment booking form
- `/admin` — Admin dashboard (appointment management, statistics)

## API Endpoints

- `GET /api/services` — List dental services
- `GET /api/stats/overview` — Clinic statistics
- `GET /api/appointments` — All appointments (admin)
- `POST /api/appointments` — Book new appointment
- `PATCH /api/appointments/:id` — Update appointment status
- `GET /api/appointments/upcoming` — Upcoming confirmed appointments

## Database Schema

- `appointments` table — patient booking records with status tracking
