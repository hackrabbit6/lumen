import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Server-side session check. The middleware does an optimistic cookie
  // redirect; this is the authoritative guard for the protected area.
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return <AppShell user={session.user}>{children}</AppShell>;
}
