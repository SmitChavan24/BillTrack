"use client";

import { useActionState, useState } from "react";
import {
  PERSONAS,
  PERSONA_GROUPS,
  PERSONA_BADGE,
  type PersonaKey,
} from "@/lib/personas";
import { savePersonas } from "@/app/signup/personas/actions";

export default function PersonaPicker({
  initial = [],
}: {
  initial?: PersonaKey[];
}) {
  const [selected, setSelected] = useState<Set<PersonaKey>>(new Set(initial));
  const [state, formAction, pending] = useActionState(savePersonas, null);

  function toggle(key: PersonaKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <form action={formAction} className="w-full max-w-2xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          What do you bill for?
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pick all that apply — you can switch between them anytime.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(PERSONA_GROUPS).map(([group, keys]) => (
          <div key={group}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {group}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {keys.map((key) => {
                const p = PERSONAS[key];
                const on = selected.has(key);
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggle(key)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      on
                        ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{p.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Bills: {p.billTerm} · Payer: {p.payerTerm}
                      </p>
                    </div>
                    <span
                      className={`ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        on
                          ? "bg-brand-600 text-white"
                          : `ring-1 ${PERSONA_BADGE[key]}`
                      }`}
                    >
                      {on ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {[...selected].map((p) => (
        <input key={p} type="hidden" name="personas" value={p} />
      ))}

      {state?.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || selected.size === 0}
        className="mt-6 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : `Continue${selected.size ? ` (${selected.size})` : ""}`}
      </button>
    </form>
  );
}
