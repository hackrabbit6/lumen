"use server";

import { revalidatePath } from "next/cache";
import { addAuditLog } from "@/lib/audit-logs";
import { requireSession } from "@/lib/session";
import { insertLead, removeLead, updateLead } from "@/lib/leads";
import { leadInputSchema } from "@/lib/data/leads";

export type ActionResult = { ok: true } | { ok: false; error: string };

function firstError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid input";
}

function revalidateAdmin() {
  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/audit-logs");
}

export async function createLeadAction(input: unknown): Promise<ActionResult> {
  await requireSession();

  const parsed = leadInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const lead = await insertLead(parsed.data);
  await addAuditLog({
    action: "create",
    resource: "lead",
    resourceId: lead.id,
    summary: `Created lead for ${lead.company}`,
  });
  revalidateAdmin();
  return { ok: true };
}

export async function updateLeadAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  await requireSession();
  if (!id) return { ok: false, error: "Missing lead id" };

  const parsed = leadInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };

  const updated = await updateLead(id, parsed.data);
  if (!updated) return { ok: false, error: "Lead not found" };

  await addAuditLog({
    action: "update",
    resource: "lead",
    resourceId: updated.id,
    summary: `Updated lead for ${updated.company}`,
  });
  revalidateAdmin();
  return { ok: true };
}

export async function deleteLeadAction(id: string): Promise<ActionResult> {
  await requireSession();
  if (!id) return { ok: false, error: "Missing lead id" };

  await removeLead(id);
  await addAuditLog({
    action: "delete",
    resource: "lead",
    resourceId: id,
    summary: `Deleted lead ${id}`,
  });
  revalidateAdmin();
  return { ok: true };
}
