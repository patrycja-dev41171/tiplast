export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.css",
    "~/assets/styles/global.scss",
  ],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
});
