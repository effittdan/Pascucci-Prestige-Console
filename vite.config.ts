import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["PP-Favicon.png", "pwa-icon-192.png", "pwa-icon-512.png"],
      manifest: {
        name: "Pascucci Prestige Command Center",
        short_name: "PrestigeOS",
        description: "Pascucci Prestige fleet, customer, reservation, and operations command center.",
        theme_color: "#090A0B",
        background_color: "#090A0B",
        display: "standalone",
        orientation: "any",
        scope: "/",
        start_url: "/command",
        icons: [
          {
            src: "/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /\.(?:jpg|jpeg|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "prestigeos-vehicle-media",
              expiration: {
                maxEntries: 48,
                maxAgeSeconds: 60 * 60 * 24 * 14,
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "prestigeos-supabase",
              networkTimeoutSeconds: 6,
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
        ],
      },
    }),
  ],
});
