<template>
  <Transition name="drawer">
    <div v-if="open" class="mobile-drawer-overlay" @click="$emit('close')">
      <div class="mobile-drawer" @click.stop>
        <div class="mobile-drawer-header">
          <img :src="logo" alt="tiPLAST" class="drawer-logo" />
          <button @click="$emit('close')"><v-icon icon="mdi-close" /></button>
        </div>

        <div class="mobile-drawer-links">
          <NuxtLink to="/admin/kontakty" @click="$emit('close')"><v-icon icon="mdi-account-multiple" />Kontakty</NuxtLink>
          <template v-if="isSuperAdmin">
            <NuxtLink to="/admin/kategorie" @click="$emit('close')"><v-icon icon="mdi-shape-plus" />Kategorie</NuxtLink>
            <NuxtLink to="/admin/kolory" @click="$emit('close')"><v-icon icon="mdi-palette" />Kolory</NuxtLink>
          </template>
          <NuxtLink to="/admin/inventory" @click="$emit('close')"><v-icon icon="mdi-warehouse" />Stany magazynowe</NuxtLink>
          <NuxtLink to="/admin/pakowanie" @click="$emit('close')"><v-icon icon="mdi-package-variant-closed" />Pakowanie</NuxtLink>
          <template v-if="isSuperAdmin">
            <NuxtLink to="/admin/email-signatures" @click="$emit('close')"><v-icon icon="mdi-email-fast-outline" />Podpis E-mail</NuxtLink>
          </template>
          <NuxtLink to="https://tiplast.pl/" target="_blank" class="web-link" @click="$emit('close')">
            <v-icon icon="mdi-open-in-new" />www.tiplast.pl
          </NuxtLink>
        </div>

        <button class="drawer-logout-btn" @click="$emit('logout')">
          <v-icon icon="mdi-logout" />Wyloguj się
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false },
});
defineEmits(['close', 'logout']);
const logo = '/images/logo_green.svg';
</script>

<style scoped lang="scss">
.mobile-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
}

.mobile-drawer {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: $admin-sidebar-bg;
  padding: 0 0 24px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.drawer-enter-from .mobile-drawer,
.drawer-leave-to .mobile-drawer {
  transform: translateX(-100%);
}
.drawer-enter-to .mobile-drawer,
.drawer-leave-from .mobile-drawer {
  transform: translateX(0);
}
.drawer-enter-active .mobile-drawer,
.drawer-leave-active .mobile-drawer {
  transition: transform 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.mobile-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.6);
  }
}

.drawer-logo {
  height: 26px;
  width: auto;
}

.mobile-drawer-links {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px 12px;

  a {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 10px;
    color: $admin-link-color;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    border-radius: 8px;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: $admin-sidebar-hover;
      color: #fff;
    }

    &.web-link {
      color: #4ade80;
    }
  }

  :deep(a.router-link-exact-active) {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-left: 3px solid #4ade80;
    padding-left: 7px;
  }
}

.drawer-logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 4px 24px 0;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.75);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #be123c;
    color: #fff;
  }
}
</style>
