<script setup>
definePageMeta({
  middleware: "admin-client",
});

const { $supabase } = useNuxtApp();
const router = useRouter();

const logout = async () => {
  await $supabase.auth.signOut();
  router.push("/");
};
</script>

<template>
  <div class="admin-wrapper">
    <div class="admin-card">
      <h1>Admin Panel</h1>
      <p class="subtitle">Jesteś zalogowana 🎉</p>

      <nav class="admin-nav">
        <NuxtLink to="/admin/products" class="nav-item"> 📦 Produkty </NuxtLink>

        <NuxtLink to="/admin/products/new" class="nav-item">
          ➕ Dodaj produkt
        </NuxtLink>

        <NuxtLink @click.prevent="logout" class="nav-item logout">
          🚪 Wyloguj się
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.admin-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.admin-card {
  background: #ffffff;
  padding: 30px;
  max-width: 450px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.admin-card h1 {
  font-size: 26px;
  margin-bottom: 10px;
  font-weight: 700;
}

.subtitle {
  font-size: 15px;
  color: #666;
  margin-bottom: 25px;
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-item {
  display: block;
  padding: 12px 16px;
  background: #f3f4f6;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  color: #333;
  transition: background 0.2s, transform 0.15s;
  cursor: pointer;
}

.nav-item:hover {
  background: #e8e9eb;
  transform: translateX(3px);
}

.logout {
  background: #ffecec;
  color: #c0392b;
}

.logout:hover {
  background: #ffd6d6;
}
</style>
