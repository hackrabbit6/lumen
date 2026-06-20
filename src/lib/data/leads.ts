import { z } from "zod";

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Won", "Lost"] as const;
export const LEAD_PRIORITIES = ["Low", "Medium", "High"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadPriority = (typeof LEAD_PRIORITIES)[number];

export interface Lead {
  id: string;
  company: string;
  contactName: string;
  contactEmail: string;
  status: LeadStatus;
  priority: LeadPriority;
  owner: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Single source of truth for create/update validation. Shared by the client
// form and the server actions so the rules can't drift apart.
export const leadInputSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(120),
  contactName: z.string().trim().min(1, "Contact name is required").max(80),
  contactEmail: z.email("Enter a valid email").max(120),
  status: z.enum(LEAD_STATUSES),
  priority: z.enum(LEAD_PRIORITIES),
  owner: z.string().trim().min(1, "Owner is required").max(80),
  notes: z.string().trim().max(800, "Notes are too long").default(""),
});

// Fields supplied by the user when creating a lead; the server fills in the
// rest (id, createdAt). Update accepts the same shape.
export type NewLeadInput = z.infer<typeof leadInputSchema>;
export type UpdateLeadInput = NewLeadInput;
