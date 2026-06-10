"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { PERSONAS, type PersonaKey } from "@/lib/personas";
import type { Bill, RepeatInterval } from "@/lib/types";
import { createBill, updateBill } from "@/app/bills/actions";

const REPEAT_OPTIONS: { value: RepeatInterval; label: string }[] = [
  { value: "none", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export default function BillForm({
  personas,
  bill,
}: {
  personas: PersonaKey[];
  bill?: Bill;
}) {
  const isEdit = !!bill;
  const action = isEdit
    ? updateBill.bind(null, bill.id)
    : createBill;
  const [state, formAction, pending] = useActionState(action, null);

  const [category, setCategory] = useState<PersonaKey>(
    bill?.category ?? personas[0],
  );
  const billTypes = PERSONAS[category].billTypes;

  const [repeat, setRepeat] = useState<RepeatInterval>(
    bill?.repeat_interval ?? PERSONAS[category].defaultRepeat,
  );

  // When category changes, update repeat default (only if creating a new bill)
  function handleCategoryChange(p: PersonaKey) {
    setCategory(p);
    if (!isEdit) {
      setRepeat(PERSONAS[p].defaultRepeat);
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label>Category</Label>
        <div className="flex flex-wrap gap-2">
          {personas.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => handleCategoryChange(p)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                category === p
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {PERSONAS[p].label}
            </button>
          ))}
        </div>
        <input type="hidden" name="category" value={category} />
      </div>

      <Field
        label={`${PERSONAS[category].payerTerm} name`}
        name="payer_name"
        defaultValue={bill?.payer_name}
        placeholder="e.g. Amit Sharma"
        required
      />
      <Field
        label={`${PERSONAS[category].payerTerm} WhatsApp number`}
        name="payer_phone"
        type="tel"
        defaultValue={bill?.payer_phone?.replace(/^91(\d{10})$/, "$1")}
        placeholder="10 digit mobile number"
        required
      />

      <div>
        <Label>{PERSONAS[category].billTerm} / description</Label>
        <input
          name="description"
          list="bill-types"
          defaultValue={bill?.description}
          placeholder={billTypes[0]}
          required
          className={inputCls}
        />
        <datalist id="bill-types">
          {billTypes.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Amount (₹)"
          name="amount"
          type="number"
          min="1"
          step="0.01"
          defaultValue={bill?.amount}
          placeholder="0"
          required
        />
        <Field
          label="Due date"
          name="due_date"
          type="date"
          defaultValue={bill?.due_date}
          required
        />
      </div>

      <div>
        <Label>Repeat</Label>
        <div className="flex flex-wrap gap-2">
          {REPEAT_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setRepeat(opt.value)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                repeat === opt.value
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="repeat_interval" value={repeat} />
        {repeat !== "none" && (
          <p className="mt-1.5 text-xs text-slate-400">
            After marking paid, you can quickly create the next bill with one tap.
          </p>
        )}
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href="/dashboard"
          className="flex-1 rounded-xl border border-slate-200 py-3 text-center font-semibold text-slate-600"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : isEdit ? "Save changes" : "Add bill"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-sm font-medium text-slate-700">
      {children}
    </span>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input {...props} className={inputCls} />
    </label>
  );
}
