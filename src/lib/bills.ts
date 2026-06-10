import type { Bill, BillStatus } from "./types";

// Overdue is computed on read (no cron) — a pending bill past its due date.
export function effectiveStatus(bill: Bill): BillStatus {
  if (bill.status === "paid") return "paid";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(bill.due_date);
  due.setHours(0, 0, 0, 0);
  if (due < today) return "overdue";
  return "pending";
}

export function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
