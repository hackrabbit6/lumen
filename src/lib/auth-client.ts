import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Defaults to the current origin; set NEXT_PUBLIC_BETTER_AUTH_URL to override.
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
