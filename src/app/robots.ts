import type { MetadataRoute } from "next";

const SITE_URL = "https://www.billtrack.me";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private / per-user pages and personal payment links should never be
      // indexed by search engines.
      disallow: [
        "/dashboard",
        "/settings",
        "/admin",
        "/feedback",
        "/bills",
        "/signup/personas",
        "/pay/",
        "/receipt/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
