<template>
  <div class="admin-layout">
    <nav class="admin-nav">
      <AdminNavTop :is-super-admin="isSuperAdmin" />
      <AdminNavBottom @logout="signOut" />
    </nav>

    <div class="admin-main">
      <AdminMobileTopbar @open-drawer="drawerOpen = true" />
      <main class="admin-content">
        <slot />
      </main>
    </div>

    <AdminMobileBottomNav @open-drawer="drawerOpen = true" />
    <AdminMobileDrawer :open="drawerOpen" :is-super-admin="isSuperAdmin" @close="drawerOpen = false" @logout="signOut" />
  </div>
</template>

<script setup>
const { logout, getUser } = useAuth();
const router = useRouter();

const isSuperAdmin = ref(false);
const drawerOpen = ref(false);

onMounted(async () => {
  const { data } = await getUser();
  isSuperAdmin.value = data?.user?.email === 'patrycja.inska.contact@gmail.com';
});

const signOut = async () => {
  await logout();
  router.push('/admin');
};
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-nav {
  width: 250px;
  background: $admin-sidebar-bg;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: none;
  }
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-content {
  flex: 1;

  @media (max-width: 768px) {
    padding-bottom: 70px;
  }
}
</style>
