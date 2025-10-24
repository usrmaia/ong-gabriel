import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev", "localhost"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
      },
    ],
  },
};

export default withPWA({
  ...nextConfig,
  // PWA config options here
  cacheOnFrontEndNav: true,
  cacheStartUrl: true,
  dest: "public",
  disable: false, // Habilitado para testar funcionalidade offline
  fallbacks: { document: "/offline.html" },
  register: true, // Registra automaticamente o service worker
  reloadOnOnline: true, // Recarrega quando voltar online
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "offlineCache",
          expiration: {
            maxEntries: 200,
          },
        },
      },
    ],
  },
});
