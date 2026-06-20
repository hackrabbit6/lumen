import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { demoUser } from "@/lib/auth-client";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = (await cookies()).get("lumen_demo_session")?.value;
  if (session !== "1") redirect("/login");

  return <AppShell user={demoUser}>{children}</AppShell>;
}
