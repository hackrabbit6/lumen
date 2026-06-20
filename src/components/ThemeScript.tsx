"use client";

import { useEffect } from "react";

const STORAGE_KEY = "lumen-theme";
type Theme = "light" | "dark";

export function ThemeScript() {
  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "dark";
    applyTheme(stored);
  }, []);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var stored = localStorage.getItem('${STORAGE_KEY}');
              var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
              var root = document.documentElement;
              if (theme === 'dark') {
                root.classList.add('dark');
              } else {
                root.classList.remove('dark');
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "light" ? "light" : "dark";
}
