<template>
  <header class="mobile-topbar">
    <img :src="logo" alt="tiPLAST" class="mobile-logo" @click="router.push('/admin/dashboard')" />
    <button class="hamburger-btn" @click="$emit('open-drawer')">
      <v-icon icon="mdi-menu" size="32" />
    </button>
  </header>
</template>

<script setup>
defineEmits(['open-drawer']);
const router = useRouter();
const logo = '/images/logo_green.svg';
</script>

<style scoped lang="scss">
.mobile-topbar {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 56px;
    background: $admin-sidebar-bg;
    position: sticky;
    top: 0;
    z-index: 50;
  }
}

.mobile-logo {
  height: 26px;
  width: auto;
}

.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  padding: 4px;
}
</style>
