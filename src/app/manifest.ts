import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "BillTrack — WhatsApp Payment Reminders & UPI Pay Links",
    short_name: "BillTrack",
    description: "Send free payment reminders on WhatsApp and collect money instantly with UPI. Built for landlords, shopkeepers, tutors and freelancers in India.",
    start_url: "/dashboard",
    scope: "/",
    lang: "en-IN",
    categories: ["finance", "business", "productivity"],
    display: "standalone",
    orientation: "portrait",
    theme_color: "#0F6E56",
    background_color: "#ffffff",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ]
  };
}
