# CLAUDE.md

Lumen Admin is a reusable admin/backoffice template for CRM, operations dashboards, content tools, and internal apps.

## Commands

```bash
bun install
bun run dev
bun run lint
bun run typecheck
bun run format:check
bun run build
bun run db:migrate
bun run db:seed
```

`better-sqlite3` is a native Node addon. Next server code runs on Node, but standalone DB scripts must use Node; keep `db:seed` as `node scripts/seed.mjs`.

## Architecture

- Auth: `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/app/api/auth/[...all]/route.ts`.
- Route protection: cookie-only optimistic check in `src/proxy.ts`, authoritative session check in `src/app/(dashboard)/layout.tsx`.
- Dashboard shell: `src/components/AppShell.tsx` + `src/components/Sidebar.tsx`.
- Leads module: `src/app/(dashboard)/leads/`, `src/lib/leads.ts`, `src/lib/data/leads.ts`, `src/components/LeadFormModal.tsx`.
- Audit logs: `src/app/(dashboard)/audit-logs/`, `src/lib/audit-logs.ts`.
- CSV export: `src/app/api/leads/export/route.ts`.
- DB schema: `src/db/schema.ts`; migrations live in `drizzle/`.

## Resource Pattern

To add a new business resource, copy the Leads slice:

1. Add a table in `src/db/schema.ts`.
2. Add zod schema and inferred types in `src/lib/data/<resource>.ts`.
3. Add server-only data access in `src/lib/<resource>.ts`.
4. Add server actions under `src/app/(dashboard)/<resource>/actions.ts`.
5. Keep the route page as a server component that reads `searchParams`; put interactive UI in a client component.
6. Add the nav item in `src/components/Sidebar.tsx`.

## Conventions

- Path alias: `@/*` -> `src/*`.
- Use `cn()` from `src/lib/utils.ts`.
- Keep DB imports out of Edge/runtime middleware. `proxy.ts` must stay cookie-only.
- Client components receive plain serializable data from server components.
- Write mutations through server actions: require session, zod-validate, mutate, write audit log when relevant, revalidate affected pages.
