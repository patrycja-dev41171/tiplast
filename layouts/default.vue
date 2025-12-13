<template>
  <v-app>
    <AppHeader />

    <v-main class="main">
      <slot />
    </v-main>

    <AppFooter />
    <p>{{ consent }}</p>
    <CookieBanner v-if="!consent?.accepted" />
  </v-app>
</template>

<script setup>
import { AppFooter } from "#components";
import AppHeader from "~/components/AppHeader.vue";

const consent = useCookie('cookies_consent')

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
