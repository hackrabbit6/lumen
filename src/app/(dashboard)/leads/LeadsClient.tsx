"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadFormModal } from "@/components/LeadFormModal";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  type Lead,
  type LeadPriority,
  type LeadStatus,
  type NewLeadInput,
} from "@/lib/data/leads";
import { createLeadAction, deleteLeadAction, updateLeadAction } from "./actions";

type StatusFilter = "All" | LeadStatus;
type PriorityFilter = "All" | LeadPriority;

const statusFilters: StatusFilter[] = ["All", ...LEAD_STATUSES];
const priorityFilters: PriorityFilter[] = ["All", ...LEAD_PRIORITIES];

function statusColor(status: LeadStatus) {
  switch (status) {
    case "Won":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "Qualified":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "Contacted":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
    case "Lost":
      return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
    case "New":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }
}

function priorityColor(priority: LeadPriority) {
  switch (priority) {
    case "High":
      return "text-red-600 dark:text-red-400";
    case "Medium":
      return "text-amber-600 dark:text-amber-400";
    case "Low":
      return "text-zinc-500 dark:text-zinc-400";
  }
}

interface LeadsClientProps {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  q: string;
  status: StatusFilter;
  priority: PriorityFilter;
}

export function LeadsClient({
  leads,
  total,
  page,
  pageSize,
  pageCount,
  q,
  status,
  priority,
}: LeadsClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(q);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [isPending, startTransition] = useTransition();

  function navigate(next: {
    q?: string;
    status?: StatusFilter;
    priority?: PriorityFilter;
    page?: number;
  }) {
    const params = new URLSearchParams();
    const nextQ = next.q ?? q;
    const nextStatus = next.status ?? status;
    const nextPriority = next.priority ?? priority;
    const nextPage = next.page ?? 1;

    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (nextStatus !== "All") params.set("status", nextStatus);
    if (nextPriority !== "All") params.set("priority", nextPriority);
    if (nextPage > 1) params.set("page", String(nextPage));

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  useEffect(() => {
    if (search === q) return;
    const timer = setTimeout(() => navigate({ q: search }), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleCreate(input: NewLeadInput) {
    const res = await createLeadAction(input);
    if (res.ok) router.refresh();
    return res;
  }

  async function handleUpdate(input: NewLeadInput) {
    if (!editing) return { ok: false, error: "Nothing to update" };
    const res = await updateLeadAction(editing.id, input);
    if (res.ok) router.refresh();
    return res;
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteLeadAction(id);
      router.refresh();
    });
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);
  const exportHref = `/api/leads/export?${new URLSearchParams({
    ...(q ? { q } : {}),
    ...(status !== "All" ? { status } : {}),
    ...(priority !== "All" ? { priority } : {}),
  })}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Leads</h1>
            <p className="text-sm text-zinc-500">Reusable CRM-style resource module.</p>
          </div>
          <div className="flex gap-2">
            <a href={exportHref} className={buttonVariants({ variant: "outline" })}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
            <Button
              className="bg-indigo-500 text-white hover:bg-indigo-600"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </header>

        <div className="space-y-6 p-6">
          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search by company, contact, email, or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-100 pr-4 pl-10 text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusFilters.map((s) => (
                    <Button
                      key={s}
                      variant={status === s ? "secondary" : "ghost"}
                      onClick={() => navigate({ status: s })}
                      className={cn(
                        status === s
                          ? "bg-indigo-500/20 text-indigo-600 hover:bg-indigo-500/30 dark:text-indigo-400"
                          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200",
                      )}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {priorityFilters.map((p) => (
                    <Button
                      key={p}
                      variant={priority === p ? "secondary" : "ghost"}
                      onClick={() => navigate({ priority: p })}
                      className={cn(
                        priority === p
                          ? "bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 dark:text-amber-400"
                          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200",
                      )}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
              <CardTitle className="text-zinc-900 dark:text-zinc-50">
                Lead Pipeline{" "}
                <span className="text-sm font-normal text-zinc-500">({total})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <UserRound className="mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                  <p className="font-medium text-zinc-600 dark:text-zinc-400">
                    No leads found
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Adjust filters or create the first lead.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zinc-100 dark:bg-zinc-800/50">
                      <tr className="text-left text-sm text-zinc-500 dark:text-zinc-400">
                        <th className="px-4 py-3 font-medium">Company</th>
                        <th className="px-4 py-3 font-medium">Contact</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Priority</th>
                        <th className="px-4 py-3 font-medium">Owner</th>
                        <th className="px-4 py-3 font-medium">Updated</th>
                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {leads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                        >
                          <td className="px-4 py-3">
                            <div className="min-w-0">
                              <p className="font-medium text-zinc-900 dark:text-zinc-200">
                                {lead.company}
                              </p>
                              <p className="max-w-xs truncate text-xs text-zinc-500">
                                {lead.notes || lead.id}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-zinc-800 dark:text-zinc-200">
                              {lead.contactName}
                            </p>
                            <p className="text-xs text-zinc-500">{lead.contactEmail}</p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={statusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn("font-medium", priorityColor(lead.priority))}
                            >
                              {lead.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                            {lead.owner}
                          </td>
                          <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                            {lead.updatedAt.toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditing(lead)}
                                className="h-8 w-8 text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                                aria-label={`Edit ${lead.company}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(lead.id)}
                                disabled={isPending}
                                className="h-8 w-8 text-zinc-500 hover:text-red-600 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-red-400"
                                aria-label={`Delete ${lead.company}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {total > 0 && (
                <div className="flex items-center justify-between gap-4 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500">
                    Showing {rangeStart}-{rangeEnd} of {total}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => navigate({ page: page - 1 })}
                      className="text-zinc-600 disabled:opacity-40 dark:text-zinc-400"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Prev
                    </Button>
                    <span className="text-sm text-zinc-500">
                      Page {page} / {pageCount}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={page >= pageCount}
                      onClick={() => navigate({ page: page + 1 })}
                      className="text-zinc-600 disabled:opacity-40 dark:text-zinc-400"
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <LeadFormModal
        key={addOpen ? "add-open" : "add-closed"}
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleCreate}
      />
      <LeadFormModal
        key={editing?.id ?? "edit-closed"}
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        lead={editing}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
