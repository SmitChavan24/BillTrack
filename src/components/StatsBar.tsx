import { formatINR } from "@/lib/bills";

export default function StatsBar({
  pending,
  overdue,
  paid,
  pendingCount,
  overdueCount,
  paidCount,
}: {
  pending: number;
  overdue: number;
  paid: number;
  pendingCount: number;
  overdueCount: number;
  paidCount: number;
}) {
  const outstanding = pending + overdue;
  const outstandingCount = pendingCount + overdueCount;

  return (
    <div className="space-y-3">
      {/* Hero: the one number that matters — money still owed to you. */}
      <div className="rounded-2xl bg-brand-600 p-5 text-white shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-white/70">
          Outstanding
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight">
          {formatINR(outstanding)}
        </p>
        <p className="mt-1 text-sm text-white/80">
          {outstandingCount} {outstandingCount === 1 ? "bill" : "bills"} awaiting
          payment
          {overdueCount > 0 && (
            <>
              {" · "}
              <span className="font-semibold text-white">
                {overdueCount} overdue
              </span>
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">
          <p className="text-xs font-medium opacity-80">Overdue</p>
          <p className="mt-1 text-lg font-bold tracking-tight">
            {formatINR(overdue)}
          </p>
          <p className="text-xs opacity-70">
            {overdueCount} {overdueCount === 1 ? "bill" : "bills"}
          </p>
        </div>
        <div className="rounded-2xl bg-brand-50 p-4 text-brand-600">
          <p className="text-xs font-medium opacity-80">Collected</p>
          <p className="mt-1 text-lg font-bold tracking-tight">
            {formatINR(paid)}
          </p>
          <p className="text-xs opacity-70">
            {paidCount} {paidCount === 1 ? "bill" : "bills"}
          </p>
        </div>
      </div>
    </div>
  );
}
