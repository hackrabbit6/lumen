import type {
  Lead,
  LeadPriority,
  LeadStatus,
  NewLeadInput,
  UpdateLeadInput,
} from "@/lib/data/leads";
import { apiFetch } from "@/lib/api/client";

export const DEFAULT_PAGE_SIZE = 8;

export interface ListLeadsOptions {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
}

export interface LeadsPage {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

function toLead(lead: Lead): Lead {
  return {
    ...lead,
    createdAt: new Date(lead.createdAt),
    updatedAt: new Date(lead.updatedAt),
  };
}

export async function fetchLeads(options: ListLeadsOptions = {}): Promise<LeadsPage> {
  const params = new URLSearchParams();
  if (options.page) params.set("page", String(options.page));
  if (options.pageSize) params.set("pageSize", String(options.pageSize));
  if (options.q) params.set("q", options.q);
  if (options.status) params.set("status", options.status);
  if (options.priority) params.set("priority", options.priority);

  const result = await apiFetch<LeadsPage>(`/leads?${params.toString()}`);
  return { ...result, leads: result.leads.map(toLead) };
}

export async function postLead(input: NewLeadInput): Promise<Lead> {
  return toLead(
    await apiFetch<Lead>("/leads", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  );
}

export async function patchLead(id: string, input: UpdateLeadInput): Promise<Lead> {
  return toLead(
    await apiFetch<Lead>(`/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  );
}

export async function deleteLead(id: string): Promise<void> {
  await apiFetch<void>(`/leads/${id}`, { method: "DELETE" });
}

export function listLeads(allLeads: Lead[], options: ListLeadsOptions = {}): LeadsPage {
  const pageSize = Math.max(1, options.pageSize ?? DEFAULT_PAGE_SIZE);
  const q = options.q?.trim().toLowerCase();

  const filtered = allLeads.filter((lead) => {
    const matchesStatus = !options.status || lead.status === options.status;
    const matchesPriority = !options.priority || lead.priority === options.priority;
    const matchesQuery =
      !q ||
      [lead.id, lead.company, lead.contactName, lead.contactEmail]
        .join(" ")
        .toLowerCase()
        .includes(q);

    return matchesStatus && matchesPriority && matchesQuery;
  });

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, options.page ?? 1), pageCount);
  const start = (page - 1) * pageSize;

  return {
    leads: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    pageCount,
  };
}

export function createLead(input: NewLeadInput): Lead {
  const now = new Date();
  return {
    id: `LEAD-${crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateLead(lead: Lead, input: UpdateLeadInput): Lead {
  return { ...lead, ...input, updatedAt: new Date() };
}

function csvCell(value: unknown) {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function leadsToCsv(leads: Lead[]) {
  const headers = [
    "ID",
    "Company",
    "Contact",
    "Email",
    "Status",
    "Priority",
    "Owner",
    "Notes",
    "Created At",
    "Updated At",
  ];
  const rows = leads.map((lead) => [
    lead.id,
    lead.company,
    lead.contactName,
    lead.contactEmail,
    lead.status,
    lead.priority,
    lead.owner,
    lead.notes,
    lead.createdAt,
    lead.updatedAt,
  ]);

  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}
