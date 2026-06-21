import { apiFetch } from "@/lib/api/client";

export type AuditAction = "create" | "update" | "delete";

export interface AuditLog {
  id: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  summary: string;
  createdAt: Date;
}

export function createAuditLog(input: {
  action: AuditAction;
  resource: string;
  resourceId: string;
  summary: string;
}): AuditLog {
  return {
    id: `LOG-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    ...input,
    createdAt: new Date(),
  };
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  const result = await apiFetch<{ auditLogs: AuditLog[] }>("/audit-logs");
  return result.auditLogs.map((log) => ({ ...log, createdAt: new Date(log.createdAt) }));
}
