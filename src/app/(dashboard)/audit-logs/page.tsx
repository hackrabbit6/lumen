import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAuditLogs } from "@/lib/api/mock-data";
import type { AuditAction } from "@/lib/api/audit-logs";
import { Activity } from "lucide-react";

function actionColor(action: AuditAction) {
  switch (action) {
    case "create":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "update":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "delete":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  }
}

export default function AuditLogsPage() {
  const logs = mockAuditLogs;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Audit Logs
            </h1>
            <p className="text-sm text-zinc-500">
              Recent create, update, and delete activity.
            </p>
          </div>
        </header>

        <div className="p-6">
          <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
              <CardTitle className="text-zinc-900 dark:text-zinc-50">
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Activity className="mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                  <p className="font-medium text-zinc-600 dark:text-zinc-400">
                    No activity yet
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Lead changes will appear here.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {logs.map((log) => (
                    <li
                      key={log.id}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-200">
                          {log.summary}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {log.resource}:{log.resourceId} ·{" "}
                          {log.createdAt.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className={actionColor(log.action)}>
                        {log.action}
                      </Badge>
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
