"use client";

import Link from "next/link";
import { useState } from "react";
import { useActionState } from "react";
import { signIn, signUp } from "@/app/auth/actions";

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, null);
  const [showPwd, setShowPwd] = useState(false);

  const needsConfirmation =
    state && "needsConfirmation" in state && state.needsConfirmation;
  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-sm">
      <div className="mb-7 text-center lg:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {isLogin ? "Welcome back" : "Create your free account"}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {isLogin
            ? "Sign in to send reminders and track payments."
            : "Takes less than a minute. No card, no charges — ever."}
        </p>
      </div>

      {needsConfirmation ? (
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center text-sm text-slate-700">
          <p className="text-base font-semibold text-slate-800">
            Almost there!
          </p>
          <p className="mt-1.5">
            We&apos;ve emailed you a confirmation link. Tap it, then{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-600 underline"
            >
              sign in
            </Link>
            .
          </p>
        </div>
      ) : (
        <form action={formAction} className="space-y-4" noValidate>
          {!isLogin && (
            <Field
              label="Your name"
              name="full_name"
              type="text"
              placeholder="e.g. Smit Chavan"
              autoComplete="name"
              autoFocus
              required
            />
          )}
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            autoFocus={isLogin}
            required
          />

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Password
              </span>
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
                aria-pressed={showPwd}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            <input
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder={isLogin ? "Your password" : "At least 6 characters"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              minLength={6}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            {!isLogin && (
              <p className="mt-1.5 text-xs text-slate-400">
                Use 6 or more characters.
              </p>
            )}
          </div>

          {state && "error" in state && state.error && (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-brand-600 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {pending
              ? "Please wait…"
              : isLogin
                ? "Sign in"
                : "Create my free account"}
          </button>

          {!isLogin && (
            <p className="text-center text-xs text-slate-400">
              By continuing you agree to use BillTrack responsibly.
            </p>
          )}
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500 lg:text-left">
        {isLogin ? (
          <>
            New to BillTrack?{" "}
            <Link
              href="/signup"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Create a free account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}
