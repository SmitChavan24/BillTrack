import Link from "next/link";
import { signOut } from "@/app/auth/actions";

export default function AppHeader({ name }: { name?: string | null }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
            ₹
          </span>
          <span className="font-bold tracking-tight">BillTrack</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/feedback"
            className="text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            Feedback
          </Link>
          <Link
            href="/settings"
            className="text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            {name ? name.split(" ")[0] : "Settings"}
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-medium text-slate-400 hover:text-red-500"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
