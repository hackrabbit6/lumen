"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Save, Loader2, UserRound } from "lucide-react";
import {
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  leadInputSchema,
  type Lead,
  type LeadPriority,
  type LeadStatus,
  type NewLeadInput,
} from "@/lib/data/leads";

type FormState = {
  company: string;
  contactName: string;
  contactEmail: string;
  status: LeadStatus;
  priority: LeadPriority;
  owner: string;
  notes: string;
};

const emptyForm: FormState = {
  company: "",
  contactName: "",
  contactEmail: "",
  status: "New",
  priority: "Medium",
  owner: "Admin",
  notes: "",
};

interface LeadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
  onSubmit: (input: NewLeadInput) => Promise<{ ok: boolean; error?: string }>;
}

export function LeadFormModal({
  open,
  onOpenChange,
  lead,
  onSubmit,
}: LeadFormModalProps) {
  const isEdit = Boolean(lead);
  const [form, setForm] = useState<FormState>(() =>
    lead
      ? {
          company: lead.company,
          contactName: lead.contactName,
          contactEmail: lead.contactEmail,
          status: lead.status,
          priority: lead.priority,
          owner: lead.owner,
          notes: lead.notes,
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = leadInputSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    const res = await onSubmit(parsed.data);
    setSubmitting(false);

    if (!res.ok) {
      setErrors({ form: res.error ?? "Something went wrong" });
      return;
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-200 bg-white p-0 text-zinc-900 sm:max-w-[620px] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
        <DialogHeader className="border-b border-zinc-200 px-6 pt-6 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
              <UserRound className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                {isEdit ? "Edit Lead" : "Add Lead"}
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                Manage a reusable CRM-style business record.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
            <Field label="Company" error={errors.company}>
              <Input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="Northstar SaaS"
              />
            </Field>
            <Field label="Contact" error={errors.contactName}>
              <Input
                value={form.contactName}
                onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
                placeholder="Ava Chen"
              />
            </Field>
            <Field label="Email" error={errors.contactEmail}>
              <Input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                placeholder="ava@example.com"
              />
            </Field>
            <Field label="Owner" error={errors.owner}>
              <Input
                value={form.owner}
                onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                placeholder="Admin"
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as LeadStatus }))
                }
                className="h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: e.target.value as LeadPriority,
                  }))
                }
                className="h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              >
                {LEAD_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Notes" error={errors.notes} className="sm:col-span-2">
              <Input
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Next step, background, or customer context"
              />
            </Field>
          </div>

          <DialogFooter className="border-t border-zinc-200 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            {errors.form && (
              <p className="mr-auto self-center text-sm text-red-500">{errors.form}</p>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="text-zinc-600 dark:text-zinc-400"
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-indigo-500 text-white hover:bg-indigo-600"
            >
              {submitting ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1 h-4 w-4" />
              )}
              {isEdit ? "Save Changes" : "Create Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="space-y-1.5">
        <Label className="text-zinc-700 dark:text-zinc-300">{label}</Label>
        {children}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
