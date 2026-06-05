<template>
  <nav class="mobile-nav">
    <NuxtLink to="/admin/dashboard" class="mobile-nav-item">
      <v-icon icon="mdi-home" size="28" />
      <span>Dashboard</span>
    </NuxtLink>
    <NuxtLink to="/admin/orders" class="mobile-nav-item">
      <v-icon icon="mdi-cart-variant" size="28" />
      <span>Zamówienia</span>
    </NuxtLink>
    <NuxtLink to="/admin/wiadomosci" class="mobile-nav-item">
      <v-icon icon="mdi-message-alert" size="28" />
      <span>Wiadomości</span>
    </NuxtLink>
    <NuxtLink to="/admin/products" class="mobile-nav-item">
      <v-icon icon="mdi-list-box" size="28" />
      <span>Produkty</span>
    </NuxtLink>
    <button class="mobile-nav-item" @click="$emit('open-drawer')">
      <v-icon icon="mdi-menu" size="28" />
      <span>Więcej</span>
    </button>
  </nav>
</template>

<script setup>
defineEmits(['open-drawer']);
</script>

<style scoped lang="scss">
.mobile-nav {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: #fff;
    border-top: 1px solid #e5e7eb;
    z-index: 100;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  }
}

.mobile-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #9ca3af;
  font-size: 10px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;

}

.mobile-nav :deep(a.router-link-exact-active) {
  color: $green;
}
</style>
