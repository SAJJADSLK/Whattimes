# Chronos Time — Vercel Deployment Guide

This project has been prepared for deployment on **Vercel** with your existing **Neon PostgreSQL** database. The frontend builds with Vite into `dist/public`, and backend API traffic is handled by a Vercel serverless catch-all function in `api/[...path].ts`.

## What was fixed

| Area | Fix applied |
|---|---|
| Vercel routing | Added `api/[...path].ts` so `/api/trpc`, OAuth callbacks, and storage proxy routes can run as serverless functions. |
| Server architecture | Split the Express app into a reusable `createApp()` factory used by both local production hosting and Vercel. |
| Static output | Updated Vercel configuration to publish the correct Vite output directory, `dist/public`. |
| Neon database | Hardened `server/db.ts` for Neon/Vercel by using a small pool, `ssl: "require"`, and `prepare: false` for PgBouncer/pooler compatibility. |
| Migrations | Replaced obsolete MySQL Drizzle migration metadata with PostgreSQL-compatible migration metadata and SQL. |
| Build warnings | Removed unresolved analytics placeholders from `client/index.html` so Vite no longer emits broken `%VITE_*%` script warnings. |
| PNPM 10 | Moved PNPM patch/override settings into `pnpm-workspace.yaml`, which is the format PNPM 10 expects. |
| Validation tools | Added `pnpm db:check` and `pnpm db:verify` helper commands. |

## Required Vercel environment variables

Set these in **Vercel Project Settings → Environment Variables** for Production, Preview, and Development as needed. Do not commit real secrets into the repository.

| Variable | Required | Value guidance |
|---|---:|---|
| `DATABASE_URL` | Yes | Use your Neon **pooled** connection string. |
| `DATABASE_URL_UNPOOLED` | Recommended | Use your Neon **unpooled** connection string for migrations or one-off DB work. |
| `POSTGRES_URL` | Optional | Same as `DATABASE_URL`; useful for Vercel/Postgres-compatible tooling. |
| `POSTGRES_URL_NON_POOLING` | Optional | Same as `DATABASE_URL_UNPOOLED`. |
| `POSTGRES_PRISMA_URL` | Optional | Neon pooled URL with `connect_timeout=15`. |
| `POSTGRES_USER` | Optional | Neon database user. |
| `POSTGRES_HOST` | Optional | Neon pooled host. |
| `POSTGRES_PASSWORD` | Optional | Neon password. |
| `POSTGRES_DATABASE` | Optional | Neon database name. |
| `JWT_SECRET` | Yes | A random secret with at least 32 characters. Generate a new one for production. |
| `VITE_APP_TITLE` | Recommended | For example, `WhatTime` or `Chronos`. |
| `VITE_APP_ID` | Required if OAuth login is used | OAuth app ID. |
| `VITE_OAUTH_PORTAL_URL` | Required if OAuth login is used | OAuth portal URL. |
| `OAUTH_SERVER_URL` | Required if OAuth login is used | OAuth server URL. |
| `OWNER_OPEN_ID` | Optional | OpenID that should become admin. |
| `BUILT_IN_FORGE_API_URL` | Optional | Only needed if `/manus-storage` proxy assets are used. |
| `BUILT_IN_FORGE_API_KEY` | Optional | Only needed if `/manus-storage` proxy assets are used. |

## Vercel project settings

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |
| Output Directory | `dist/public` |
| Node Version | `22.x` |

The repository contains `vercel.json`, so Vercel should automatically use the correct output directory and route rewrites.

## Deployment commands

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

To verify the Neon connection locally before deploying, run:

```bash
DATABASE_URL="your-neon-pooled-url" pnpm db:check
DATABASE_URL="your-neon-pooled-url" pnpm db:verify
```

If you ever point this project to a new empty PostgreSQL database, run:

```bash
DATABASE_URL="your-neon-pooled-url" pnpm db:push
```

Your provided Neon database was already checked and contains all required tables and columns, so no destructive schema change was needed during this preparation.

## Validation completed

| Check | Result |
|---|---|
| `pnpm check` | Passed. |
| `pnpm build` | Passed. |
| Neon connection test | Passed; connected to database `neondb` as `neondb_owner`. |
| Required table/column verification | Passed for `users`, `cities`, `userFavoriteCities`, `teamDashboards`, `meetingInvites`, and `countdownTimers`. |
| Local production smoke test | Passed; homepage returned `200 OK`, and `cities.getRegions` returned database-backed data. |
| Vercel CLI local build | Could not complete in this sandbox because the CLI requested a valid Vercel token. The project-level build and runtime checks passed independently. |

## Important security note

The connection credentials you shared are real database credentials. After the site is deployed successfully, consider rotating the Neon password and updating the Vercel environment variables. This prevents any accidental exposure from chat logs or temporary environments.
