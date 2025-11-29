<template>
  <NuxtLink :href="`/produkt/${product.url}`" class="product-card">
    <img
      :src="product.photos?.[0]?.url"
      :alt="product.photos?.[0]?.alt || product.display_name"
      class="product-img"
    />

    <div class="product-info">
      <h3 class="name">{{ product.display_name }}</h3>

      <p class="price">
        {{ product.prices.pln.base_price }} {{ product.prices.pln.symbol }}
      </p>

      <div class="color">
        <span>Kolor:</span>
        <span class="color-dot" :style="{ backgroundColor: product.color }"></span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
});
</script>

<style scoped lang="scss">
.product-card {
  background: #fff;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }

  .product-img {
    width: 100%;
    height: 240px;
    object-fit: cover;
  }

  .product-info {
    padding: 16px;

    .name {
      font-size: 18px;
      margin-bottom: 8px;
      color: #222;
    }

    .price {
      font-weight: 600;
      color: #32aa27;
      margin-bottom: 8px;
    }

    .color {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #555;
      font-size: 14px;

      .color-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #ccc;
      }
    }
  }
}
</style>
