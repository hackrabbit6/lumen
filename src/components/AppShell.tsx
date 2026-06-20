"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";

export interface SessionUser {
  name: string;
  email: string;
  image?: string | null;
}

interface AppShellProps {
  children: React.ReactNode;
  user: SessionUser;
}

export function AppShell({ children, user }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);

  return (
    <>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
      />
      <div
        className={`min-h-screen pt-14 transition-all duration-300 lg:pt-0 ${
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        {children}
      </div>
    </>
  );
}
