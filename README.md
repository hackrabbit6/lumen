# Lumen Admin

A frontend-only admin/backoffice template for CRM, operations dashboards, content tools, and internal apps. Built with **Next.js 16**, **React 19**, **TypeScript**, Tailwind CSS, and shadcn/ui. The demo runs on local mock data and is ready to connect to a separate backend such as Elysia, Node, Go, or Java.

![Dashboard](public/screenshots/dashboard.png)

## Screenshots

![Leads](public/screenshots/leads.png)

![Audit Logs](public/screenshots/audit-logs.png)

## Features

- Demo auth with cookie/localStorage session
- Protected dashboard routes
- Leads module with pagination, search, status filter, priority filter, create, edit, delete
- Browser-side CSV export
- Audit log UI ready for a backend endpoint
- Dashboard stats, recent leads, and recent activity
- Collapsible sidebar, mobile drawer, sign out, dark/light theme
- CI-ready scripts for lint, typecheck, format check, and build

## Stack

- Next.js App Router / React / TypeScript
- Tailwind CSS / shadcn/ui / Lucide React
- Zod
- Bun

## Quick Start

```bash
bun install
cp .env.example .env
bun run dev
```

Open `http://localhost:3000`. The demo login is prefilled:

```text
admin@lumen.app
password123
```

## Scripts

```bash
bun run dev
bun run lint
bun run typecheck
bun run format:check
bun run build
```

## Backend Integration

The template currently uses mock data. When connecting a backend, replace or extend the API layer in `src/lib/api/`.

```text
src/lib/api/client.ts      fetch wrapper
src/lib/api/leads.ts       leads list/create/update/delete
src/lib/api/audit-logs.ts  audit log contracts
```

`.env.example` includes:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
```

Suggested API shape:

```text
POST   /auth/login
POST   /auth/logout
GET    /me
GET    /leads
POST   /leads
PATCH  /leads/:id
DELETE /leads/:id
GET    /audit-logs
```

## Deployment

This is a frontend template and can be deployed to Vercel, Netlify, or Cloudflare Pages. The mock demo does not require a database.

For a real backend, configure:

```text
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
```

## Resume Summary

```text
Lumen Admin frontend-separated backoffice template
Stack: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Zod

- Built a reusable admin frontend template with demo auth, protected routes, responsive app shell, theme switching, and sign out.
- Implemented a Leads module with pagination, search, status/priority filters, create/edit/delete, and CSV export.
- Separated the API client and mock data layer so the frontend can later connect to an Elysia or REST backend without binding to one backend stack.
- Added lint, typecheck, format check, and production build scripts so the project can start future CRM, operations, or internal-tool frontends.
```

## Interview Pitch

```text
Lumen is a frontend-separated admin template I built for CRM, operations dashboards, and internal tools.

It uses Next.js, React, TypeScript, Tailwind, and Zod. It runs with mock data for easy preview, and the API client layer is ready to connect to an Elysia or REST backend later.

The goal is to show practical business frontend delivery: tables, filters, modal forms, status display, validation, responsive admin layout, CSV export, and clean frontend/backend boundaries.
```
