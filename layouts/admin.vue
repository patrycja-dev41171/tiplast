<template>
  <div class="admin-layout">
    <nav class="admin-nav">
      <div class="nav-top">
        <NuxtLink to="/admin/dashboard"><v-icon icon="mdi-home"></v-icon>Dashboard</NuxtLink>
        <NuxtLink to="/admin/products"><v-icon icon="mdi-list-box"></v-icon> Produkty</NuxtLink>
        <NuxtLink to="/admin/kategorie"><v-icon icon="mdi-shape-plus" ></v-icon> Kategorie</NuxtLink>
        <NuxtLink to="/admin/kolory"><v-icon icon="mdi-palette"></v-icon> Kolory</NuxtLink>
      </div>

      <button class="logout-btn" @click="logout">Wyloguj <v-icon icon="mdi-logout"></v-icon></button>
    </nav>

    <main class="admin-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp();
const router = useRouter();

const logout = async () => {
  await $supabase.auth.signOut();
  router.push("/login");
};
</script>

<style scoped  lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.admin-nav {
  width: 250px;
  background: #f3f4f6;
  padding: 20px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  position: sticky;
  top: 0;
}

/* Linki u góry */
.nav-top {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-top a {
    display: flex;
    align-items: center;
    gap: 12px;
  padding: 10px 14px;
  border-radius: 6px;
  color: #333;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
}

.nav-top a:hover {
  background: #e5e7eb;
}

.nav-top .router-link-active {
  background: #2563eb;
  color: white;
  &:hover {
    background: #2563eb;
  color: white;
  cursor: default;
  }
}

/* Wylogowanie – przyklejone do dołu */
.logout-btn {
  margin-top: auto;
  padding: 12px 14px;
  background: #797979;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.logout-btn:hover {
  background: #be123c;
}

/* Treść */
.admin-content {
  flex: 1;
  padding: 30px;
}
</style>
