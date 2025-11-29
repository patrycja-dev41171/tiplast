<template>
  <div class="products-wrapper">
    <div class="products-grid">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
      />
    </div>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: Array,
})
</script>

<style scoped lang="scss">
.products-wrapper {
  flex: 1;
}
.products-grid {
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
</style>
