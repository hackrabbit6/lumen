"use client";

const SESSION_KEY = "lumen-demo-session";
const TOKEN_KEY = "lumen-api-token";
const COOKIE_NAME = "lumen_demo_session";

export interface DemoUser {
  name: string;
  email: string;
}

export const demoUser: DemoUser = {
  name: "Admin User",
  email: "admin@lumen.app",
};

export function getDemoSession(): DemoUser | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(SESSION_KEY);
  return value ? (JSON.parse(value) as DemoUser) : null;
}

export function signInDemo() {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(demoUser));
  document.cookie = `${COOKIE_NAME}=1; path=/; max-age=604800; samesite=lax`;
}

export async function signInApi(email: string, password: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  const data = (await response.json()) as { token: string; user: DemoUser };
  window.localStorage.setItem(TOKEN_KEY, data.token);
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
  document.cookie = `${COOKIE_NAME}=1; path=/; max-age=604800; samesite=lax`;
}

export function signOutDemo() {
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

export function getApiToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
