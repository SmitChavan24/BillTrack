"use client";

import Link from "next/link";
import { useState } from "react";
import type { Bill, Profile } from "@/lib/types";
import { PERSONAS, type PersonaKey } from "@/lib/personas";
import { effectiveStatus } from "@/lib/bills";
import StatsBar from "./StatsBar";
import BillCard from "./BillCard";

type Filter = PersonaKey | "all";

export default function DashboardClient({
  bills,
  profile,
}: {
  bills: Bill[];
  profile: Profile;
}) {
  const personas = profile.personas ?? [];
  const [filter, setFilter] = useState<Filter>(
    profile.primary_persona ?? "all",
  );

  const visible =
    filter === "all" ? bills : bills.filter((b) => b.category === filter);

  const totals = visible.reduce(
    (acc, b) => {
      const s = effectiveStatus(b);
      if (s === "paid") {
        acc.paid += b.amount;
        acc.paidCount += 1;
      } else if (s === "overdue") {
        acc.overdue += b.amount;
        acc.overdueCount += 1;
      } else {
        acc.pending += b.amount;
        acc.pendingCount += 1;
      }
      return acc;
    },
    {
      pending: 0,
      overdue: 0,
      paid: 0,
      pendingCount: 0,
      overdueCount: 0,
      paidCount: 0,
    },
  );

  const upiId = profile.upi_id ?? "";
  const payeeName = profile.full_name ?? "BillTrack";

  return (
    <div className="space-y-5">
      {!upiId && (
        <Link
          href="/settings"
          className="block rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          Add your UPI ID in Settings to enable reminders & pay links →
        </Link>
      )}

      {personas.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </Chip>
          {personas.map((p) => (
            <Chip key={p} active={filter === p} onClick={() => setFilter(p)}>
              {PERSONAS[p].label}
            </Chip>
          ))}
        </div>
      )}

      <StatsBar {...totals} />

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-500">
          {visible.length} {visible.length === 1 ? "bill" : "bills"}
        </h2>
        <Link
          href="/bills/new"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + New bill
        </Link>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-500">No bills yet.</p>
          <Link
            href="/bills/new"
            className="mt-3 inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Add your first bill
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((b) => (
            <BillCard key={b.id} bill={b} upiId={upiId} payeeName={payeeName} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-brand-600 text-white"
          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
