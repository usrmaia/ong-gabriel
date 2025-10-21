import type { MetadataRoute } from "next";

import { env } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        // PWA files
        "/manifest.json",
        // "/sw.js",
        // "/offline.html",
        // Assets
        "/icon-*.png",
        "/apple-touch-icon.png",
        "/*.svg",
        "/*jpg",
        "/*.png",
      ],
      // Bloquear áreas administrativas e privadas
      disallow: ["/admin", "/employee", "/patient", "/user"],
      crawlDelay: 1,
    },
    sitemap: `${env.NEXT_PUBLIC_URL}/sitemap.xml`,
    host: env.NEXT_PUBLIC_URL,
  };
}
