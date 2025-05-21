// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@vueuse/nuxt',
    '@vueuse/sound/nuxt', 
    // "nuxt-chatgpt"
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
  // chatgpt: {
  //   apiKey: process.env.CHATGPT_API_KEY,
  // },
})