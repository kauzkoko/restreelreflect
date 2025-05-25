// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@vueuse/nuxt',
    '@vueuse/sound/nuxt', 
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
  app: {
    head: {
      title: 'Rest, Reel, Reflect',
      meta: [
        // { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' },
      ]
    }
  },
  devServer: {
    port: 3333,
  }
})