import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Returns the current session or throws. Use inside server actions / route
 * handlers to ensure a mutation can only run for an authenticated user — the
 * layout/proxy guards protect navigation, but actions are directly callable.
 */
export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
