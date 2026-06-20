# CLAUDE.md

Lumen Admin is a frontend-only admin/backoffice template. It uses mock data by default and is intended to connect to a separate backend later, such as Elysia.

## Commands

```bash
bun install
bun run dev
bun run lint
bun run typecheck
bun run format:check
bun run build
```

## Architecture

- Demo auth: `src/lib/auth-client.ts`, `src/proxy.ts`, `src/app/(dashboard)/layout.tsx`.
- Dashboard shell: `src/components/AppShell.tsx` + `src/components/Sidebar.tsx`.
- Leads UI: `src/app/(dashboard)/leads/`, `src/components/LeadFormModal.tsx`.
- Audit log UI: `src/app/(dashboard)/audit-logs/`.
- API boundary and mock data: `src/lib/api/`.
- Shared lead schema/types: `src/lib/data/leads.ts`.

## Backend Boundary

The frontend should not depend on SQLite, Drizzle, server actions, or one backend stack. Future Elysia integration should happen behind `src/lib/api/*`.

Suggested backend endpoints:

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

## Resource Pattern

To add a new business resource, copy the Leads slice:

1. Add zod schema and inferred types in `src/lib/data/<resource>.ts`.
2. Add mock helpers or fetch calls in `src/lib/api/<resource>.ts`.
3. Add dashboard UI under `src/app/(dashboard)/<resource>/`.
4. Add a nav item in `src/components/Sidebar.tsx`.

## Conventions

- Path alias: `@/*` -> `src/*`.
- Use `cn()` from `src/lib/utils.ts`.
- Keep backend-specific code behind `src/lib/api/*`.
- Client components should own demo-only local state.
