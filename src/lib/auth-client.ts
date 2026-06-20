"use client";

const SESSION_KEY = "lumen-demo-session";
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

export function signOutDemo() {
  window.localStorage.removeItem(SESSION_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}
