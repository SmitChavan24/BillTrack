import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import AdminClient from "@/components/AdminClient";
import type {
  AdminBillRow,
  AdminFeedbackRow,
  AdminUserRow,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_admin")
    .eq("id", user.id)
    .single();

  // Hard gate: non-admins never see this page.
  if (!profile?.is_admin) redirect("/dashboard");

  const [usersRes, billsRes, feedbackRes] = await Promise.all([
    supabase.rpc("admin_users"),
    supabase.rpc("admin_bills"),
    supabase.rpc("admin_feedback"),
  ]);

  return (
    <>
      <AppHeader name={profile.full_name} />
      <main className="mx-auto max-w-5xl px-5 py-6">
        <Link href="/dashboard" className="text-sm text-slate-500">
          ← Back to app
        </Link>
        <h1 className="mb-5 mt-2 text-2xl font-bold tracking-tight">
          Admin panel
        </h1>
        <AdminClient
          users={(usersRes.data ?? []) as AdminUserRow[]}
          bills={(billsRes.data ?? []) as AdminBillRow[]}
          feedback={(feedbackRes.data ?? []) as AdminFeedbackRow[]}
        />
      </main>
    </>
  );
}
