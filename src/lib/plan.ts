// Free vs Pro. The limit itself is enforced in the database
// (supabase/migrations/006_pro_plan.sql); keep FREE_BILL_LIMIT in sync with it.
export const FREE_BILL_LIMIT = 10;
export const PRO_PRICE = 199;
export const UPGRADE_URL = "https://pay.billtrack.me";

export function isPro(profile: {
  plan: string;
  plan_expires_at: string | null;
}): boolean {
  if (profile.plan !== "paid") return false;
  return !profile.plan_expires_at || new Date(profile.plan_expires_at) > new Date();
}

// The database raises "FREE_LIMIT: ..." when a Free user goes over the limit.
export function friendlyBillError(message: string): string {
  if (message.includes("FREE_LIMIT")) {
    return `The Free plan allows ${FREE_BILL_LIMIT} active bills. Mark a bill as paid, or upgrade to Pro (₹${PRO_PRICE}/month) at ${UPGRADE_URL} for unlimited bills.`;
  }
  return message;
}
