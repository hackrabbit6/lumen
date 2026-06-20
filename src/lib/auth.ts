import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { schema } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    // Set to true and wire up sendVerificationEmail to require email verification.
    requireEmailVerification: false,
  },
  // nextCookies() must be the last plugin so it can set cookies on the
  // outgoing response (e.g. from server actions).
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
