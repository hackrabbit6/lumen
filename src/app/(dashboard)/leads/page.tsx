import { getLeadsPage } from "@/lib/leads";
import {
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  type LeadPriority,
  type LeadStatus,
} from "@/lib/data/leads";
import { LeadsClient } from "./LeadsClient";

function parseStatus(value: string | undefined): LeadStatus | undefined {
  return LEAD_STATUSES.find((s) => s === value);
}

function parsePriority(value: string | undefined): LeadPriority | undefined {
  return LEAD_PRIORITIES.find((p) => p === value);
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    priority?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const q = sp.q ?? "";
  const status = parseStatus(sp.status);
  const priority = parsePriority(sp.priority);

  const result = await getLeadsPage({ page, q, status, priority });

  return (
    <LeadsClient
      {...result}
      q={q}
      status={status ?? "All"}
      priority={priority ?? "All"}
    />
  );
}
