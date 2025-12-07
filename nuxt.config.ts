export default defineNuxtConfig({
  ssr: true,
  nitro: {
    externals: {
      external: ["@supabase/supabase-js"]
    }
  },
  vite: {
    ssr: {
      noExternal: ["@supabase/supabase-js"]
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_variables.scss" as *;',
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ["@supabase/supabase-js"]
  },
  build: {
    transpile: ["vuetify"],
  },
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.css",
    "~/assets/scss/main.scss",
  ],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY, // server only
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
});
