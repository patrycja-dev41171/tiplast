<template>
  <div class="nav-logo">
    <img :src="logo" alt="tiPLAST" class="sidebar-logo" />
  </div>

  <div class="nav-top">
    <NuxtLink to="/admin/dashboard"><v-icon icon="mdi-home" />Dashboard</NuxtLink>
    <NuxtLink to="/admin/orders"><v-icon icon="mdi-cart-variant" />Zamówienia</NuxtLink>
    <NuxtLink to="/admin/zwroty"><v-icon icon="mdi-package-variant-closed-remove" />Zwroty</NuxtLink>
    <NuxtLink to="/admin/wiadomosci"><v-icon icon="mdi-message-alert" />Wiadomości</NuxtLink>
    <NuxtLink to="/admin/kontakty"><v-icon icon="mdi-account-multiple" />Kontakty</NuxtLink>
    <NuxtLink to="/admin/products"><v-icon icon="mdi-list-box" />Produkty</NuxtLink>
    <template v-if="isSuperAdmin">
      <NuxtLink to="/admin/kategorie"><v-icon icon="mdi-shape-plus" />Kategorie</NuxtLink>
      <NuxtLink to="/admin/kolory"><v-icon icon="mdi-palette" />Kolory</NuxtLink>
    </template>
    <NuxtLink to="/admin/inventory"><v-icon icon="mdi-warehouse" />Stany magazynowe</NuxtLink>
    <NuxtLink to="/admin/pakowanie"><v-icon icon="mdi-package-variant-closed" />Pakowanie</NuxtLink>
    <template v-if="isSuperAdmin">
      <NuxtLink to="/admin/email-signatures"><v-icon icon="mdi-email-fast-outline" />Podpis E-mail</NuxtLink>
    </template>
  </div>
</template>

<script setup>
defineProps({
  isSuperAdmin: { type: Boolean, default: false },
});
const logo = '/images/logo_green.svg';
</script>

<style scoped lang="scss">
.nav-logo {
  padding: 22px 20px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 10px;
}

.sidebar-logo {
  height: 32px;
  width: auto;
}

.nav-top {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 12px;

  a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    color: $admin-link-color;
    font-weight: 500;
    font-size: 15px;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: $admin-sidebar-hover;
      color: #fff;
    }

  }

  :deep(a.router-link-exact-active) {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-left: 3px solid #4ade80;
    padding-left: 9px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      cursor: default;
    }
  }
}
</style>
