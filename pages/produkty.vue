<template>
  <div class="products-page pa-6">
    <h2 class="title">Nasze produkty:</h2>

    <div class="products-grid">
      <NuxtLink
        v-for="product in products"
        :href="`produkt/${product.url}`"
        :key="product.id"
        class="product-card"
      >
        <img
          :src="product.photos[0].url"
          :alt="product.photos[0].alt"
          class="product-img"
        />

        <div class="product-info">
          <h3 class="name">{{ product.display_name }}</h3>
          <p class="price">
            {{ product.prices.pln.base_price }} {{ product.prices.pln.symbol }}
          </p>
          <div class="color">
            <span>Kolor:</span>
            <span
              class="color-dot"
              :style="{ backgroundColor: product.color }"
            ></span>
            <span class="color-name">{{
              product.technical_details.find((e) => e.name === "kolor").value
            }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp();
const products = ref([]);

onMounted(async () => {
  const { data, error } = await $supabase
    .from("products")
    .select("*")
    .eq("hidden", false);

  if (error) console.error(error);
  else products.value = data;
});
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.products-page {
  max-width: 1200px;
  margin: 0 auto;

  .title {
    margin-top: 30px;
    font-size: 28px;
    margin-bottom: 30px;
    text-align: left;
    color: #333;
  }

  .products-grid {
    display: grid;
    gap: 30px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

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
      height: 220px;
      padding: 0px;
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
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid #ccc;
        }
      }
    }
  }
}
</style>
