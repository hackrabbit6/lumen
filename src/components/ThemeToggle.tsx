"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { applyTheme } from "@/components/ThemeScript";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function subscribe(callback: () => void) {
  if (typeof document === "undefined") return () => {};
  const obs = new MutationObserver(callback);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}

function getSnapshot(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {mounted && theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
