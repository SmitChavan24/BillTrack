import { FREE_BILL_LIMIT, PRO_PRICE, UPGRADE_URL, isPro } from "@/lib/plan";
import type { Profile } from "@/lib/types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PlanBanner({
  profile,
  activeBills,
}: {
  profile: Profile;
  activeBills: number;
}) {
  if (isPro(profile)) {
    return (
      <div className="mb-4 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
        <span className="font-semibold">Pro</span> · Unlimited bills
        {profile.plan_expires_at && <> · until {fmtDate(profile.plan_expires_at)}</>}
        {" · "}
        <a href={UPGRADE_URL} className="font-medium underline">
          Extend
        </a>
      </div>
    );
  }

  const atLimit = activeBills >= FREE_BILL_LIMIT;
  return (
    <div
      className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
        atLimit
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-slate-200 bg-white text-slate-600"
      }`}
    >
      <span className="font-semibold">Free plan</span> · {activeBills}/{FREE_BILL_LIMIT}{" "}
      active bills
      {atLimit && " · Limit reached: mark a bill as paid to add more"}
      {" · "}
      <a href={UPGRADE_URL} className="font-medium text-brand-700 underline">
        Upgrade to Pro (₹{PRO_PRICE}/month) for unlimited
      </a>
    </div>
  );
}
