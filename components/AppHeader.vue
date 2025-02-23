<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    app
    class="drawer pa-6"
    width="310"
  >
    <v-toolbar-title class="title mb-10">TIPLAST</v-toolbar-title>
    <v-list class="list">
      <v-list-item
        class="list-item"
        title="Strona główna"
        @click="navigateTo('/')"
      />
      <v-divider />
      <v-list-item
        class="list-item"
        title="O nas"
        @click="navigateTo('/about')"
      />
      <v-divider />

      <v-list-item
        class="list-item"
        title="Produkty"
        @click="navigateTo('/contact')"
      />
      <v-divider />

      <v-list-item
        class="list-item mt-10 contact"
        title="Kontakt"
        @click="navigateTo('/contact')"
      />
    </v-list>
  </v-navigation-drawer>
  <v-app-bar color="white" elevation="0" class="app-bar">
    <v-container class="app-bar-container pa-0">
      <v-toolbar-title class="title">TIPLAST</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon
        :icon="drawer ? 'mdi-close' : 'mdi-menu'"
        @click.stop="drawer = !drawer"
        class="d-sm-none no-ripple"
        style="font-size: 22px"
        :ripple="false"
      />
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const drawer = ref(false);
const router = useRouter();

const navigateTo = (path) => {
  drawer.value = false;
  router.push(path);
};
</script>

<style lang="scss" scoped>
.app-bar-container {
  max-width: 1024px;
  width: 100%;
  margin: 0 auto; /* Wyśrodkowanie */
  display: flex;
  align-items: center;
}

.title {
  font-weight: 800;
  font-size: 25px;
}

::v-deep(.v-btn__overlay) {
  opacity: 0;
}

.list {
  .list-item {
    padding: 20px 0;
  }
  ::v-deep(.v-list-item-title) {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px !important;
  }

  .contact {
    text-align: center;
    padding: 10px;
    border: 2px solid black;
    ::v-deep(.v-list-item-title) {
      text-transform: uppercase !important;
    }
  }
}
</style>
