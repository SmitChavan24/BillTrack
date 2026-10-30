"use client";

import { useMemo, useState, useTransition } from "react";
import { formatINR } from "@/lib/bills";
import { replyToFeedback, setUserPlan } from "@/app/admin/actions";
import { isPro } from "@/lib/plan";
import type {
  AdminBillRow,
  AdminFeedbackRow,
  AdminUserRow,
} from "@/lib/types";

type Tab = "users" | "bills" | "feedback";

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default function AdminClient({
  users,
  bills,
  feedback,
}: {
  users: AdminUserRow[];
  bills: AdminBillRow[];
  feedback: AdminFeedbackRow[];
}) {
  const [tab, setTab] = useState<Tab>("users");

  const stats = useMemo(() => {
    const totalBilled = bills.reduce((s, b) => s + Number(b.amount), 0);
    const paid = bills.filter((b) => b.status === "paid").length;
    const openFeedback = feedback.filter((f) => f.status === "open").length;
    return {
      users: users.length,
      bills: bills.length,
      totalBilled,
      paid,
      openFeedback,
    };
  }, [users, bills, feedback]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "users", label: `Users (${users.length})` },
    { key: "bills", label: `Bills (${bills.length})` },
    {
      key: "feedback",
      label: `Feedback${stats.openFeedback ? ` (${stats.openFeedback} open)` : ""}`,
    },
  ];

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="App users" value={String(stats.users)} />
        <StatCard label="Total bills" value={String(stats.bills)} />
        <StatCard label="Total billed" value={formatINR(stats.totalBilled)} />
        <StatCard
          label="Paid / pending"
          value={`${stats.paid} / ${stats.bills - stats.paid}`}
        />
      </div>

      <div className="mb-4 flex gap-2 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
              tab === t.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && <UsersTable users={users} />}
      {tab === "bills" && <BillsTable bills={bills} />}
      {tab === "feedback" && <FeedbackPanel feedback={feedback} />}
    </div>
  );
}

function UsersTable({ users }: { users: AdminUserRow[] }) {
  if (users.length === 0)
    return <p className="text-sm text-slate-500">No users yet.</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Plan</th>
            <th className="px-4 py-3">Bills</th>
            <th className="px-4 py-3">Billed</th>
            <th className="px-4 py-3">Paid</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Last active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-800">
                  {u.full_name || "—"}
                  {u.is_admin && (
                    <span className="ml-2 rounded bg-brand-100 px-1.5 py-0.5 text-xs font-semibold text-brand-700">
                      admin
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">{u.email || "—"}</div>
              </td>
              <td className="px-4 py-3">
                <PlanCell user={u} />
              </td>
              <td className="px-4 py-3 text-slate-700">{u.bill_count}</td>
              <td className="px-4 py-3 text-slate-700">
                {formatINR(Number(u.total_amount))}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {u.paid_count}/{u.bill_count}
              </td>
              <td className="px-4 py-3 text-slate-500">
                {fmtDate(u.created_at)}
              </td>
              <td className="px-4 py-3 text-slate-500">
                {fmtDateTime(u.last_sign_in_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Pro is bought on pay.billtrack.me; after checking the payment there, the
// admin switches it on (or extends it) here.
function PlanCell({ user }: { user: AdminUserRow }) {
  const [pending, startTransition] = useTransition();
  const pro = isPro(user);

  function change(plan: "free" | "paid", months = 1) {
    const label =
      plan === "paid"
        ? `Give ${user.email ?? "this user"} Pro for ${months} month(s)?`
        : `Move ${user.email ?? "this user"} back to Free?`;
    if (!confirm(label)) return;
    startTransition(async () => {
      const result = await setUserPlan(user.id, plan, months);
      if (result?.error) alert(result.error);
    });
  }

  return (
    <div className="space-y-1">
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          pro ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-600"
        }`}
      >
        {pro ? "Pro" : user.plan === "paid" ? "Pro (expired)" : "Free"}
      </span>
      {pro && user.plan_expires_at && (
        <div className="text-xs text-slate-400">
          until {fmtDate(user.plan_expires_at)}
        </div>
      )}
      <div className="flex gap-2 text-xs">
        <button
          disabled={pending}
          onClick={() => change("paid", 1)}
          className="font-medium text-brand-700 hover:underline disabled:opacity-50"
        >
          +1 month Pro
        </button>
        {pro && (
          <button
            disabled={pending}
            onClick={() => change("free")}
            className="text-slate-500 hover:underline disabled:opacity-50"
          >
            Set Free
          </button>
        )}
      </div>
    </div>
  );
}

function BillsTable({ bills }: { bills: AdminBillRow[] }) {
  if (bills.length === 0)
    return <p className="text-sm text-slate-500">No bills yet.</p>;

  const STATUS: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    overdue: "bg-red-100 text-red-700",
    paid: "bg-brand-100 text-brand-700",
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Payer</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">For</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Due</th>
            <th className="px-4 py-3">Owner</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {bills.map((b) => (
            <tr key={b.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">
                {b.payer_name}
              </td>
              <td className="px-4 py-3 text-slate-600">
                <a
                  href={`tel:${b.payer_phone}`}
                  className="hover:text-brand-600"
                >
                  {b.payer_phone}
                </a>
              </td>
              <td className="px-4 py-3 text-slate-600">{b.description}</td>
              <td className="px-4 py-3 font-semibold text-slate-800">
                {formatINR(Number(b.amount))}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS[b.status] ?? "bg-slate-100 text-slate-600"}`}
                >
                  {b.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500">{fmtDate(b.due_date)}</td>
              <td className="px-4 py-3">
                <div className="text-slate-700">{b.owner_name || "—"}</div>
                <div className="text-xs text-slate-400">
                  {b.owner_email || "—"}
                </div>
              </td>
              <td className="px-4 py-3 text-slate-500">
                {fmtDateTime(b.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeedbackPanel({ feedback }: { feedback: AdminFeedbackRow[] }) {
  if (feedback.length === 0)
    return <p className="text-sm text-slate-500">No feedback yet.</p>;

  return (
    <div className="space-y-3">
      {feedback.map((f) => (
        <FeedbackItem key={f.id} item={f} />
      ))}
    </div>
  );
}

function FeedbackItem({ item }: { item: AdminFeedbackRow }) {
  const [reply, setReply] = useState(item.admin_reply ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await replyToFeedback(item.id, reply);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-800">
            {item.user_name || "Unknown"}
          </p>
          <p className="text-xs text-slate-400">
            {item.user_email || "—"} · {fmtDateTime(item.created_at)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            item.status === "replied"
              ? "bg-brand-100 text-brand-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {item.status === "replied" ? "Replied" : "Open"}
        </span>
      </div>

      <p className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
        {item.message}
      </p>

      <div className="mt-3">
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Your reply
        </label>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
          placeholder="Write a reply the user will see in their app…"
          className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={save}
            disabled={pending || !reply.trim()}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {pending
              ? "Saving…"
              : item.admin_reply
                ? "Update reply"
                : "Send reply"}
          </button>
          {item.replied_at && (
            <span className="text-xs text-slate-400">
              Last replied {fmtDateTime(item.replied_at)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
