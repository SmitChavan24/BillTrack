"use client";

import { useActionState, useState } from "react";
import {
  PERSONAS,
  PERSONA_GROUPS,
  type PersonaKey,
} from "@/lib/personas";
import type { Profile } from "@/lib/types";
import { saveSettings } from "@/app/settings/actions";

export default function SettingsForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(saveSettings, null);
  const [selected, setSelected] = useState<Set<PersonaKey>>(
    new Set(profile.personas ?? []),
  );

  function toggle(key: PersonaKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <Field
          label="Display name"
          name="full_name"
          defaultValue={profile.full_name ?? ""}
          placeholder="Your name or business name"
        />
        <Field
          label="Your UPI ID"
          name="upi_id"
          defaultValue={profile.upi_id ?? ""}
          placeholder="yourname@okhdfcbank"
        />
        <p className="text-xs text-slate-400">
          This UPI ID is embedded in every WhatsApp reminder and pay link so your
          payers can pay you instantly.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Your personas
        </h2>
        <div className="space-y-4">
          {Object.entries(PERSONA_GROUPS).map(([group, keys]) => (
            <div key={group}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {group}
              </p>
              <div className="flex flex-wrap gap-2">
                {keys.map((key) => {
                  const on = selected.has(key);
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => toggle(key)}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                        on
                          ? "bg-brand-600 text-white"
                          : "bg-white text-slate-600 ring-1 ring-slate-200"
                      }`}
                    >
                      {PERSONAS[key].label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {[...selected].map((p) => (
        <input key={p} type="hidden" name="personas" value={p} />
      ))}

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state && "saved" in state && state.saved && (
        <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
          Saved.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
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
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}
