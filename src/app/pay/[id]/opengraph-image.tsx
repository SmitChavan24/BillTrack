import { ImageResponse } from "next/og";
import { formatINR } from "@/lib/bills";

export const dynamic = "force-dynamic";
export const alt = "Payment request";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Payment = {
  amount: number;
  description: string;
  payee_name: string;
};

async function getPayment(id: string): Promise<Payment | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_payment`,
    {
      method: "POST",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_bill_id: id }),
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as Payment[];
  return data?.[0] ?? null;
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPayment(id);

  const amount = p ? formatINR(p.amount) : "Payment request";
  const payee = p?.payee_name ?? "BillTrack";
  const desc = p?.description ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0F6E56",
          color: "white",
          padding: "80px",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, opacity: 0.8 }}>Payment request from</div>
          <div style={{ fontSize: 56, fontWeight: 700, marginTop: 8 }}>
            {payee}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -2 }}>
            {amount}
          </div>
          {desc ? (
            <div style={{ fontSize: 40, opacity: 0.9, marginTop: 4 }}>
              {desc}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 32,
            opacity: 0.85,
          }}
        >
          Tap to pay securely via UPI · Secured by BillTrack
        </div>
      </div>
    ),
    { ...size },
  );
}
