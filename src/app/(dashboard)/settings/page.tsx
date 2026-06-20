"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  User,
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  Monitor,
  Save,
  Check,
} from "lucide-react";
import { applyTheme } from "@/components/ThemeScript";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
] as const;

type ThemeChoice = "light" | "dark" | "system";

function subscribeToClass(callback: () => void) {
  if (typeof document === "undefined") return () => {};
  const obs = new MutationObserver(callback);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}

function readCurrentTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

const themeOptions: { id: ThemeChoice; label: string; icon: React.ElementType }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });
  const currentTheme = useSyncExternalStore(
    subscribeToClass,
    readCurrentTheme,
    () => "dark" as const,
  );
  const [preferredTheme, setPreferredTheme] = useState<ThemeChoice>("dark");
  const theme: ThemeChoice = preferredTheme === "system" ? currentTheme : preferredTheme;
  const [savedFlash, setSavedFlash] = useState(false);

  function selectTheme(choice: ThemeChoice) {
    setPreferredTheme(choice);
    if (choice === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    } else {
      applyTheme(choice);
    }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Settings
            </h1>
            <p className="text-sm text-zinc-500">Manage your account settings</p>
          </div>
        </header>

        <div className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            <Card className="shrink-0 border-zinc-200 bg-white lg:w-64 dark:border-zinc-800 dark:bg-zinc-900/50">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200",
                      )}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            <div className="flex-1 space-y-6">
              {activeTab === "profile" && (
                <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-50">
                      Profile Settings
                    </CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">
                      Update your account information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600">
                        <span className="text-2xl font-bold text-white">A</span>
                      </div>
                      <Button
                        variant="outline"
                        className="border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Change Avatar
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-zinc-700 dark:text-zinc-300"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          defaultValue="Admin"
                          className="border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-zinc-700 dark:text-zinc-300"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          defaultValue="User"
                          className="border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-zinc-700 dark:text-zinc-300"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue="admin@lumen.app"
                          className="border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-zinc-700 dark:text-zinc-300"
                        >
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          defaultValue="+1 234-567-8900"
                          className="border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-50">
                      Notification Preferences
                    </CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">
                      Choose how you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="max-w-md space-y-4">
                      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Notification Channels
                      </h3>
                      {[
                        { key: "email", label: "Email Notifications" },
                        { key: "push", label: "Push Notifications" },
                        { key: "sms", label: "SMS Notifications" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between gap-4"
                        >
                          <span className="text-zinc-700 dark:text-zinc-200">
                            {item.label}
                          </span>
                          <button
                            onClick={() =>
                              setNotifications((prev) => ({
                                ...prev,
                                [item.key]: !prev[item.key as keyof typeof notifications],
                              }))
                            }
                            className={cn(
                              "relative h-6 w-11 rounded-full transition-colors",
                              notifications[item.key as keyof typeof notifications]
                                ? "bg-indigo-500"
                                : "bg-zinc-300 dark:bg-zinc-700",
                            )}
                            aria-label={`Toggle ${item.label}`}
                          >
                            <span
                              className={cn(
                                "absolute top-1 left-0 h-4 w-4 rounded-full bg-white transition-transform",
                                notifications[item.key as keyof typeof notifications]
                                  ? "translate-x-6"
                                  : "translate-x-1",
                              )}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="max-w-md space-y-4">
                      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Notification Types
                      </h3>
                      {[{ key: "marketing", label: "Marketing & Promotions" }].map(
                        (item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="text-zinc-700 dark:text-zinc-200">
                              {item.label}
                            </span>
                            <button
                              onClick={() =>
                                setNotifications((prev) => ({
                                  ...prev,
                                  [item.key]:
                                    !prev[item.key as keyof typeof notifications],
                                }))
                              }
                              className={cn(
                                "relative h-6 w-11 rounded-full transition-colors",
                                notifications[item.key as keyof typeof notifications]
                                  ? "bg-indigo-500"
                                  : "bg-zinc-300 dark:bg-zinc-700",
                              )}
                              aria-label={`Toggle ${item.label}`}
                            >
                              <span
                                className={cn(
                                  "absolute top-1 left-0 h-4 w-4 rounded-full bg-white transition-transform",
                                  notifications[item.key as keyof typeof notifications]
                                    ? "translate-x-6"
                                    : "translate-x-1",
                                )}
                              />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "security" && (
                <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-50">
                      Security Settings
                    </CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">
                      Manage your account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="currentPassword"
                            className="text-zinc-700 dark:text-zinc-300"
                          >
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                            className="border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="newPassword"
                            className="text-zinc-700 dark:text-zinc-300"
                          >
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            className="border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-zinc-700 dark:text-zinc-300"
                          >
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            className="border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "appearance" && (
                <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-50">
                      Appearance Settings
                    </CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">
                      Customize the look and feel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Theme
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {themeOptions.map((opt) => {
                          const Icon = opt.icon;
                          const active = theme === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => selectTheme(opt.id)}
                              className={cn(
                                "rounded-lg border-2 p-4 text-center transition-colors",
                                active
                                  ? "border-indigo-500 bg-indigo-500/5"
                                  : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-zinc-600",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "mx-auto mb-2 h-6 w-6",
                                  active
                                    ? "text-indigo-500"
                                    : "text-zinc-600 dark:text-zinc-300",
                                )}
                              />
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  active
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-zinc-700 dark:text-zinc-300",
                                )}
                              >
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {savedFlash && (
                      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                        <Check className="h-4 w-4" />
                        Theme updated
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
