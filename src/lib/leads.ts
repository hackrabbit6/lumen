import "server-only";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import type {
  Lead,
  LeadPriority,
  LeadStatus,
  NewLeadInput,
  UpdateLeadInput,
} from "@/lib/data/leads";

type LeadRow = typeof leads.$inferSelect;

export const DEFAULT_PAGE_SIZE = 8;

export interface ListLeadsOptions {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
}

export interface LeadsPage {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

function rowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    company: row.company,
    contactName: row.contactName,
    contactEmail: row.contactEmail,
    status: row.status as LeadStatus,
    priority: row.priority as LeadPriority,
    owner: row.owner,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function generateId() {
  return `LEAD-${crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

function buildWhere(options: ListLeadsOptions) {
  const q = options.q?.trim();
  const filters = [
    options.status ? eq(leads.status, options.status) : undefined,
    options.priority ? eq(leads.priority, options.priority) : undefined,
    q
      ? or(
          like(leads.company, `%${q}%`),
          like(leads.contactName, `%${q}%`),
          like(leads.contactEmail, `%${q}%`),
          like(leads.id, `%${q}%`),
        )
      : undefined,
  ].filter(Boolean);

  return filters.length ? and(...filters) : undefined;
}

export async function getLeads(): Promise<Lead[]> {
  const rows = await db.select().from(leads).orderBy(desc(leads.updatedAt));
  return rows.map(rowToLead);
}

export async function getLeadsPage(options: ListLeadsOptions = {}): Promise<LeadsPage> {
  const pageSize = Math.max(1, options.pageSize ?? DEFAULT_PAGE_SIZE);
  const where = buildWhere(options);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(leads)
    .where(where);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, options.page ?? 1), pageCount);

  const rows = await db
    .select()
    .from(leads)
    .where(where)
    .orderBy(desc(leads.updatedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { leads: rows.map(rowToLead), total, page, pageSize, pageCount };
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const [row] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return row ? rowToLead(row) : null;
}

export async function insertLead(input: NewLeadInput): Promise<Lead> {
  const now = new Date();
  const [row] = await db
    .insert(leads)
    .values({
      id: generateId(),
      company: input.company,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      status: input.status,
      priority: input.priority,
      owner: input.owner,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return rowToLead(row);
}

export async function updateLead(
  id: string,
  input: UpdateLeadInput,
): Promise<Lead | null> {
  const [row] = await db
    .update(leads)
    .set({
      company: input.company,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      status: input.status,
      priority: input.priority,
      owner: input.owner,
      notes: input.notes,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, id))
    .returning();
  return row ? rowToLead(row) : null;
}

export async function removeLead(id: string): Promise<void> {
  await db.delete(leads).where(eq(leads.id, id));
}

export async function getLeadsForExport(options: ListLeadsOptions = {}) {
  const rows = await db
    .select()
    .from(leads)
    .where(buildWhere(options))
    .orderBy(desc(leads.updatedAt));

  return rows.map(rowToLead);
}
