<template>
  <ClientOnly>
    <v-navigation-drawer v-model="drawer" temporary app class="drawer pa-6" width="310">
      <v-toolbar-title class="mb-10"><v-img cover src="/images/logo_black.svg" class="img"
          @click="navigateTo('/')"></v-img></v-toolbar-title>
      <v-list class="list">
        <v-list-item class="list-item" title="Strona główna" @click="navigateTo('/')" />
        <v-divider />
        <v-list-item class="list-item" title="O nas" @click="navigateTo('/#o-nas')" />
        <v-divider />

        <v-list-item class="list-item" title="Produkty" @click="navigateTo('/produkty')" />
        <v-divider />

        <v-list-item class="list-item" title="FAQ" @click="navigateTo('/faq')" />
        <v-divider />

        <v-list-item class="list-item mt-16 contact" title="Kontakt" @click="navigateTo('/kontakt')" />
      </v-list>
    </v-navigation-drawer>
  </ClientOnly>
  <v-app-bar color="white" elevation="0" class="app-bar my-md-0 py-md-3">
    <v-container class="app-bar-container pa-6 pa-md-0 px-md-6">
      <v-toolbar-title class="title" @click="navigateTo('/')"><v-img cover src="/images/logo_black.svg"
          class="img"></v-img></v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="position-relative">
        <v-app-bar-nav-icon icon="mdi-cart-outline" class="d-md-none no-ripple mr-2" style="font-size: 20px" :ripple="false"
          @click="navigateTo('/koszyk')" />
        <div v-if="basketQty" class="badge d-md-none">{{ basketQty }}</div>
      </div>

      <v-app-bar-nav-icon :icon="drawer ? 'mdi-close' : 'mdi-menu'" @click.stop="drawer = !drawer"
        class="d-md-none no-ripple" style="font-size: 22px" :ripple="false" />
      <v-list class="list-desktop d-none d-md-flex">
        <v-list-item class="list-item" title="Strona główna" @click="navigateTo('/')" />
        <v-divider />
        <v-list-item class="list-item" title="O nas" @click="navigateTo('/#o-nas')" />
        <v-divider />

        <v-list-item class="list-item" title="Produkty" @click="navigateTo('/produkty')" />
        <v-divider />

        <v-list-item class="list-item" title="FAQ" @click="navigateTo('/faq')" />
        <v-divider />

        <v-list-item class="list-item" title="Kontakt" @click="navigateTo('/kontakt')" />
        <v-list-item class="list-item contact d-flex" @click="navigateTo('/koszyk')"><v-icon icon="mdi-cart-outline"
            class="mr-2"></v-icon>Koszyk<span v-if="basketQty" class="badge-md">{{ basketQty }}</span></v-list-item>
      </v-list>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from "vue-router";

const drawer = ref(false);
const router = useRouter();

const basketTotal = useCookie('cart_total')
const basketQty = useCookie('cart_quantity')

const navigateTo = (path) => {
  drawer.value = false;
  router.push(path);
};
</script>

<style lang="scss" scoped>
.img {
  z-index: 10000;
  cursor: pointer;
  max-width: 180px;

  @media screen and (min-width: 900px) {
    max-width: 3000px;
  }
}

.app-bar {
  background-color: rgb(152, 95, 20);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

.app-bar-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  /* Wyśrodkowanie */
  display: flex;
  align-items: center;
}

.title {
  font-weight: 1000;
  font-size: 25px;
  cursor: pointer;
  z-index: 100;
  max-width: 150px;
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

    ::v-deep(.v-list-item-title) {
      text-transform: uppercase !important;
    }
  }
}

.list-desktop {
  .list-item {
    padding: 0 20px;
    font-size: 18px;

    ::v-deep(.v-list-item-title) {
      font-weight: 600;
    }
  }

  .contact {
    padding: 0 20px;
    margin-left: 30px;
    color: #32aa27;
    font-size: 16px;
    font-weight: 700;
    // background-color: #32aa27;
    text-transform: uppercase;

    ::v-deep(.v-list-item-title) {
      text-transform: uppercase !important;
    }
  }
}

.badge {
  width: auto;
  min-width: 24px;
  padding: 0 4px;
  height: 24px;
  background-color: #32aa27;
  position: absolute;
  z-index: 40;
  bottom: -7px;
  right: -5px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: white;
  font-weight: 600;
}

.badge-md {
  min-width: 24px;
  padding: 3px 4px;
  height: 24px;
  background-color: #32aa27;
  border-radius: 4px;
  font-size: 13px;
  color: white;
  font-weight: 600;
  margin-left: 7px;
}
</style>
