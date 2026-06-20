import { NextResponse } from "next/server";
import { getLeadsForExport } from "@/lib/leads";
import {
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  type LeadPriority,
  type LeadStatus,
} from "@/lib/data/leads";

function parseStatus(value: string | null): LeadStatus | undefined {
  return LEAD_STATUSES.find((s) => s === value);
}

function parsePriority(value: string | null): LeadPriority | undefined {
  return LEAD_PRIORITIES.find((p) => p === value);
}

function csvCell(value: unknown) {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const leads = await getLeadsForExport({
    q: url.searchParams.get("q") ?? undefined,
    status: parseStatus(url.searchParams.get("status")),
    priority: parsePriority(url.searchParams.get("priority")),
  });

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
  const body = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

  return new NextResponse(body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=leads.csv",
    },
  });
}
