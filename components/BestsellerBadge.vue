<template>
  <span class="bestseller-badge" :class="`size-${size}`">
    <v-icon icon="mdi-star" :size="size === 'lg' ? 17 : 12" class="mr-1" />
    Bestseller
  </span>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: "sm", // "sm" – miniaturka, "lg" – strona produktu
  },
});
</script>

<style scoped lang="scss">
.bestseller-badge {
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid #32aa27;
  border-radius: 8px;
  color: #32aa27;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  pointer-events: none;

  &.size-sm {
    top: 10px;
    left: 10px;
    padding: 3px 8px;
    font-size: 11px;
  }

  @media (max-width: 599px) {
    &.size-sm {
      top: 8px;
      left: 8px;
      padding: 2px 6px;
      font-size: 10px;
      letter-spacing: 0.3px;

      :deep(.v-icon) {
        font-size: 10px !important; // nadpisuje rozmiar ustawiony inline przez Vuetify
      }
    }
  }

  &.size-lg {
    top: 14px;
    left: 14px;
    padding: 6px 14px;
    font-size: 14px;
  }
}
</style>
