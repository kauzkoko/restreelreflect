// https://nuxt.com/docs/api/configuration/nuxt-config
import process from "node:process";

const sw = process.env.SW === "true";

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Rest, Reel, Reflect',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#000000' },
        { 'http-equiv': 'Permissions-Policy', content: 'speaker-selection=*' },
      ],
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@vueuse/nuxt',
    '@vueuse/sound/nuxt',
    "@vite-pwa/nuxt",
  ],
  sound: {
    sounds: {
      scan: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['vue-demi'],
    },
  },
  ssr: false,
  devServer: {
    port: 3333,
  },
  pwa: {
    strategies: sw ? "injectManifest" : "generateSW",
    srcDir: sw ? "service-worker" : undefined,
    filename: sw ? "sw.ts" : undefined,
    registerType: "autoUpdate",
    manifest: {
      name: "Rest, Reel, Reflect",
      short_name: "Rest, Reel, Reflect",
      theme_color: "#000000",
      background_color: "#000000",
      display: "standalone",
      icons: [
        {
          src: "pwa-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico,mp3,m4a}"],
      maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MiB limit to handle larger assets
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico,mp3,m4a}"],
      maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
    },
    client: {
      // installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      // periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
  future: {
    typescriptBundlerResolution: true,
  },
  experimental: {
    payloadExtraction: true,
    watcher: "parcel",
  },
  nitro: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
    prerender: {
      routes: ["/"],
    },
  },
  imports: {
    autoImport: true,
  },
})