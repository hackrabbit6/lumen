"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Archive,
  Boxes,
  CheckCircle2,
  FileEdit,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const icons = {
  archive: Archive,
  boxes: Boxes,
  check: CheckCircle2,
  draft: FileEdit,
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: keyof typeof icons;
  iconColor?: string;
  // Optional trend line ("+12.5%" / "-3%"). Omit for plain counts.
  change?: string;
  changeType?: "positive" | "negative";
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "positive",
  icon,
  iconColor = "text-indigo-500 dark:text-indigo-400",
}: StatsCardProps) {
  const Icon = icons[icon];

  return (
    <Card className="border-zinc-200 bg-white backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                {changeType === "positive" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    changeType === "positive"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  {change}
                </span>
                <span className="text-sm text-zinc-500">from last month</span>
              </div>
            )}
          </div>
          <div className="rounded-xl bg-zinc-100 p-3 dark:bg-zinc-800/50">
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
