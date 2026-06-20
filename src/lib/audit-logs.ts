import "server-only";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";

type AuditLogRow = typeof auditLogs.$inferSelect;

export type AuditAction = "create" | "update" | "delete";

export interface AuditLog {
  id: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  summary: string;
  createdAt: Date;
}

function rowToAuditLog(row: AuditLogRow): AuditLog {
  return {
    id: row.id,
    action: row.action as AuditAction,
    resource: row.resource,
    resourceId: row.resourceId,
    summary: row.summary,
    createdAt: row.createdAt,
  };
}

export async function addAuditLog(input: {
  action: AuditAction;
  resource: string;
  resourceId: string;
  summary: string;
}) {
  await db.insert(auditLogs).values({
    id: `LOG-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    ...input,
    createdAt: new Date(),
  });
}

export async function getAuditLogs(limit = 50): Promise<AuditLog[]> {
  const rows = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);

  return rows.map(rowToAuditLog);
}
