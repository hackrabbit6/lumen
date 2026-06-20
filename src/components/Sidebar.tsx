"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ThemeToggle";
import { signOut } from "@/lib/auth-client";
import type { SessionUser } from "@/components/AppShell";
import {
  LayoutDashboard,
  Activity,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
  UserRound,
} from "lucide-react";

// Edit this list to define your app's navigation.
const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: UserRound },
  { href: "/audit-logs", label: "Audit Logs", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const text = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div
      className={cn(
        dim,
        "flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20",
      )}
    >
      <span className={cn("font-bold text-white", text)}>L</span>
    </div>
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  user: SessionUser;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UserCard({ collapsed, user }: { collapsed: boolean; user: SessionUser }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    router.replace("/login");
    router.refresh();
  };

  const avatar = (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-semibold text-white">
      {initials(user.name || user.email)}
    </div>
  );

  if (collapsed) {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        title={`Sign out (${user.email})`}
        className="mx-auto block disabled:opacity-50"
      >
        {avatar}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-3 py-2">
      {avatar}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-200">{user.name}</p>
        <p className="truncate text-xs text-zinc-500">{user.email}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
        disabled={loading}
        title="Sign out"
        className="h-8 w-8 shrink-0 text-zinc-400 hover:text-zinc-100"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

function SidebarContent({ collapsed, user }: { collapsed: boolean; user: SessionUser }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-14 items-center border-b border-zinc-800 px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <BrandMark />
            <span className="text-lg font-bold text-zinc-50">Lumen</span>
          </Link>
        )}
        {collapsed && <BrandMark />}
        {!collapsed && <ThemeToggle />}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "h-11 w-full justify-start gap-3",
                    collapsed && "justify-center px-0",
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-400"
                      : "text-zinc-400 hover:text-zinc-200",
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-zinc-800 p-4">
        <UserCard collapsed={collapsed} user={user} />
      </div>
    </div>
  );
}

export function Sidebar({ collapsed, onToggle, user }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 hidden h-screen flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300 lg:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent collapsed={collapsed} user={user} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute top-20 -right-3 h-6 w-6 rounded-full border border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
        </Button>
      </aside>

      <Sheet open={!collapsed} onOpenChange={onToggle}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-64 border-zinc-800 bg-zinc-950 p-0"
        >
          <SidebarContent collapsed={false} user={user} />
        </SheetContent>
      </Sheet>

      <header className="fixed top-0 right-0 left-0 z-30 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-zinc-400"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="ml-3 flex items-center gap-2">
            <BrandMark size="sm" />
            <span className="font-bold text-zinc-50">Lumen</span>
          </Link>
        </div>
        <ThemeToggle />
      </header>
    </>
  );
}
