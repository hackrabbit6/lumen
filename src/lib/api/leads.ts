import type {
  Lead,
  LeadPriority,
  LeadStatus,
  NewLeadInput,
  UpdateLeadInput,
} from "@/lib/data/leads";

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
