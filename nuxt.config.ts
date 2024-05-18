// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@vueuse/nuxt"],
  routeRules: {
    // "/": { ssr: false },
  },
  nitro: {
    experimental: {
      websocket: true,
      database: true,
    },
    database: {
      default: {
        connector: "sqlite",
        options: { name: "db" },
      },
    },
  },
});
