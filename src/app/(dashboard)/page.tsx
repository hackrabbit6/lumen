import Link from "next/link";
import { StatsCard } from "@/components/StatsCard";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Activity, UserRound } from "lucide-react";
import { getAuditLogs } from "@/lib/audit-logs";
import { getLeads } from "@/lib/leads";
import type { LeadStatus } from "@/lib/data/leads";

function statusColor(status: LeadStatus) {
  switch (status) {
    case "Won":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "Qualified":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "Contacted":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
    case "New":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "Lost":
      return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
  }
}

export default async function Dashboard() {
  const [leads, logs] = await Promise.all([getLeads(), getAuditLogs(5)]);
  const count = (s: LeadStatus) => leads.filter((i) => i.status === s).length;
  const recent = leads.slice(0, 5);
  const activeCount = leads.filter((i) =>
    ["New", "Contacted", "Qualified"].includes(i.status),
  ).length;
  const highPriority = leads.filter((i) => i.priority === "High").length;

  const stats = [
    {
      title: "Total Leads",
      value: leads.length,
      icon: "boxes",
      color: "text-indigo-400",
    },
    {
      title: "In Progress",
      value: activeCount,
      icon: "check",
      color: "text-sky-400",
    },
    {
      title: "High Priority",
      value: highPriority,
      icon: "draft",
      color: "text-amber-400",
    },
    {
      title: "Won",
      value: count("Won"),
      icon: "archive",
      color: "text-emerald-400",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Dashboard
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">Welcome back</p>
          </div>
          <Link
            href="/leads"
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-indigo-500 px-2.5 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-indigo-600 focus-visible:ring-3 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
          >
            Manage Leads
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </header>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <StatsCard
                key={s.title}
                title={s.title}
                value={String(s.value)}
                icon={s.icon}
                iconColor={s.color}
              />
            ))}
          </div>

          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
              <CardTitle className="text-zinc-900 dark:text-zinc-50">
                Recent Leads
              </CardTitle>
              <Link
                href="/leads"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-zinc-500 dark:text-zinc-400",
                })}
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recent.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <UserRound className="mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                  <p className="font-medium text-zinc-600 dark:text-zinc-400">
                    No leads yet
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Run <code className="font-mono">bun run db:seed</code> or add one from
                    the Leads page.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {recent.map((lead) => (
                    <li
                      key={lead.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                          {lead.company}
                        </p>
                        <p className="max-w-md truncate text-xs text-zinc-500">
                          {lead.contactName} · {lead.owner}
                        </p>
                      </div>
                      <Badge variant="outline" className={statusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
              <CardTitle className="text-zinc-900 dark:text-zinc-50">
                Recent Activity
              </CardTitle>
              <Link
                href="/audit-logs"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-zinc-500 dark:text-zinc-400",
                })}
              >
                View logs
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Activity className="mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                  <p className="font-medium text-zinc-600 dark:text-zinc-400">
                    No activity yet
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {logs.map((log) => (
                    <li key={log.id} className="flex items-center gap-3 px-4 py-3">
                      <UserRound className="h-4 w-4 text-zinc-400" />
                      <div className="min-w-0">
                        <p className="truncate text-sm text-zinc-900 dark:text-zinc-200">
                          {log.summary}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {log.createdAt.toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
