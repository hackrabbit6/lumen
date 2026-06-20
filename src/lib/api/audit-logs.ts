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
