import type { PersonaKey } from "./personas";

export type BillStatus = "pending" | "paid" | "overdue";
export type RepeatInterval = "none" | "weekly" | "monthly" | "quarterly" | "yearly";
export type Language = "en" | "hi" | "hinglish";

export interface Bill {
  id: string;
  user_id: string;
  payer_name: string;
  payer_phone: string; // with country code, e.g. 919876543210
  description: string;
  amount: number;
  due_date: string; // ISO date (YYYY-MM-DD)
  category: PersonaKey;
  status: BillStatus;
  repeat_interval: RepeatInterval;
  parent_bill_id: string | null;
  reminder_sent_at: string | null;
  payment_claimed_at: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  upi_id: string | null;
  handle: string | null;
  personas: PersonaKey[];
  primary_persona: PersonaKey | null;
  language: Language | null;
  plan: "free" | "paid";
  plan_expires_at: string | null;
  is_admin: boolean;
  created_at: string;
}

// In-app feedback: a user message + an optional single admin reply.
export interface Feedback {
  id: string;
  user_id: string;
  message: string;
  admin_reply: string | null;
  status: "open" | "replied";
  created_at: string;
  replied_at: string | null;
}

// Rows returned by the admin RPC functions (security definer).
export interface AdminUserRow {
  id: string;
  full_name: string | null;
  email: string | null;
  upi_id: string | null;
  plan: "free" | "paid";
  plan_expires_at: string | null;
  primary_persona: PersonaKey | null;
  personas: PersonaKey[];
  is_admin: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  bill_count: number;
  total_amount: number;
  paid_count: number;
  pending_count: number;
  last_bill_at: string | null;
}

export interface AdminBillRow {
  id: string;
  owner_name: string | null;
  owner_email: string | null;
  payer_name: string;
  payer_phone: string;
  description: string;
  amount: number;
  due_date: string;
  category: PersonaKey;
  status: BillStatus;
  repeat_interval: RepeatInterval;
  reminder_sent_at: string | null;
  created_at: string;
}

export interface AdminFeedbackRow {
  id: string;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  message: string;
  admin_reply: string | null;
  status: "open" | "replied";
  created_at: string;
  replied_at: string | null;
}

// Form payloads
export type BillInput = Omit<
  Bill,
  "id" | "user_id" | "status" | "reminder_sent_at" | "created_at" | "parent_bill_id"
> & { status?: BillStatus };
