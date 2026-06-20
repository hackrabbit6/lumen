import type { AuditLog } from "@/lib/api/audit-logs";
import type { Lead } from "@/lib/data/leads";

const now = new Date("2026-06-21T02:00:00.000Z");

export const mockLeads: Lead[] = [
  {
    id: "LEAD-001",
    company: "Northstar SaaS",
    contactName: "Ava Chen",
    contactEmail: "ava.chen@example.com",
    status: "Contacted",
    priority: "High",
    owner: "Admin",
    notes: "Requested a lightweight CRM starter for the operations team.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "LEAD-002",
    company: "Bright Ops",
    contactName: "Leo Wang",
    contactEmail: "leo.wang@example.com",
    status: "Qualified",
    priority: "Medium",
    owner: "Admin",
    notes: "Good fit for internal tooling and dashboard templates.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "LEAD-003",
    company: "Acme Retail",
    contactName: "Mia Liu",
    contactEmail: "mia.liu@example.com",
    status: "New",
    priority: "Low",
    owner: "Admin",
    notes: "Needs follow-up after initial website inquiry.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "LEAD-004",
    company: "Helio Studio",
    contactName: "Noah Zhang",
    contactEmail: "noah.zhang@example.com",
    status: "Won",
    priority: "High",
    owner: "Admin",
    notes: "Converted after demoing the reusable admin workflow.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "LEAD-005",
    company: "Quiet Systems",
    contactName: "Emma Xu",
    contactEmail: "emma.xu@example.com",
    status: "Lost",
    priority: "Medium",
    owner: "Admin",
    notes: "Paused due to budget timing.",
    createdAt: now,
    updatedAt: now,
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "LOG-001",
    action: "create",
    resource: "lead",
    resourceId: "LEAD-001",
    summary: "Created lead for Northstar SaaS",
    createdAt: now,
  },
  {
    id: "LOG-002",
    action: "update",
    resource: "lead",
    resourceId: "LEAD-002",
    summary: "Qualified lead for Bright Ops",
    createdAt: now,
  },
];
