<template>
  <v-app>
    <AppHeader />
    <v-main class="main">
      <slot />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup>
import { AppFooter } from "#components";
import AppHeader from "~/components/AppHeader.vue";
</script>

<style lang="scss" scoped>

@include md {
  .main {
    padding-top: 76px;
    width: 100%;
    width: 100vw;
  }
}
</style>
