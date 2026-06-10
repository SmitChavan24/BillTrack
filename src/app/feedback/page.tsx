import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import FeedbackForm from "@/components/FeedbackForm";
import type { Feedback } from "@/lib/types";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function FeedbackPage() {
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

  const { data: items } = await supabase
    .from("feedback")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const feedback = (items ?? []) as Feedback[];

  return (
    <>
      <AppHeader name={profile?.full_name} />
      <main className="mx-auto max-w-2xl px-5 py-6">
        <Link href="/dashboard" className="text-sm text-slate-500">
          ← Back
        </Link>
        <h1 className="mb-1 mt-2 text-2xl font-bold tracking-tight">Feedback</h1>
        <p className="mb-5 text-sm text-slate-500">
          Send us a message — replies from the team appear below.
        </p>

        <FeedbackForm />

        {feedback.length > 0 && (
          <div className="mt-6 space-y-3">
            <h2 className="text-sm font-semibold text-slate-500">
              Your messages
            </h2>
            {feedback.map((f) => (
              <div
                key={f.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="whitespace-pre-wrap text-sm text-slate-800">
                    {f.message}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      f.status === "replied"
                        ? "bg-brand-100 text-brand-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {f.status === "replied" ? "Replied" : "Open"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{fmt(f.created_at)}</p>

                {f.admin_reply && (
                  <div className="mt-3 rounded-xl bg-brand-50 p-3">
                    <p className="text-xs font-semibold text-brand-700">
                      Reply from BillTrack
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                      {f.admin_reply}
                    </p>
                    {f.replied_at && (
                      <p className="mt-1 text-xs text-slate-400">
                        {fmt(f.replied_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
