export default defineNuxtRouteMiddleware(async (to) => {
  // pozwalamy na panel logowania
  if (to.path === "/admin") return;

  const nuxt = useNuxtApp();

  // ⛔ zabezpieczenie przed undefined po odświeżeniu
  if (!nuxt.$supabase) {
    console.warn("Supabase not ready yet → skipping check");
    return;
  }

  const { data, error } = await nuxt.$supabase.auth.getSession();

  if (!data?.session) {
    return navigateTo("/admin");
  }
});
