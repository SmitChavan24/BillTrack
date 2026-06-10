import { ImageResponse } from "next/og";

export const alt = "BillTrack — WhatsApp payment reminders & UPI pay links";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          padding: "90px",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(255,255,255,0.18)",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            ₹
          </div>
          <div style={{ fontSize: 36, fontWeight: 700 }}>BillTrack</div>
        </div>

        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -2,
            marginTop: 48,
            maxWidth: 980,
          }}
        >
          Payment reminders on WhatsApp. Get paid faster over UPI.
        </div>

        <div style={{ fontSize: 34, opacity: 0.85, marginTop: 28 }}>
          Free for landlords, shops, tutors &amp; freelancers in India
        </div>
      </div>
    ),
    { ...size },
  );
}
