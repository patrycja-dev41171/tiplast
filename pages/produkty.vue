<template>
  <div class="products-page pa-6">
    <!-- LEWA KOLUMNA – FILTRY -->
    <CategoryFilters
      :categories="categories"
      :selectedCategory="selectedCategory"
      :mobileFiltersOpen="mobileFiltersOpen"
      :productsCount="filteredProducts.length"
      @update:selectedCategory="selectedCategory = $event"
      @close="mobileFiltersOpen = false"
    />

    <!-- MOBILE BUTTON -->
    <button class="mobile-filters-btn" @click="mobileFiltersOpen = true">
      Filtruj <v-icon color="#fff" icon="mdi-filter-menu-outline" class="mx-1" size="small"></v-icon>
    </button>

    <!-- PRAWA KOLUMNA – PRODUKTY -->
    <div class="products-wrapper">
      <h2 class="title">{{ header }}:</h2>

      <div class="products-grid">
        <NuxtLink
          v-for="product in filteredProducts"
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
              {{ product.prices.pln.base_price }}
              {{ product.prices.pln.symbol }}
            </p>
            <div class="color">
              <span>Kolor:</span>
              <span
                class="color-dot"
                :style="{ backgroundColor: product.color }"
              ></span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp();
const products = ref([]);
const categories = ref([]);
const selectedCategory = ref(0);
const mobileFiltersOpen = ref(false);

const loadCategories = async () => {
  const { data, error } = await $supabase
    .from("categories")
    .select("*")
    .order("display_name");

  if (!error) categories.value = data.sort((a, b) => a.id - b.id);
};

onMounted(async () => {
  await loadCategories();

  const { data, error } = await $supabase
    .from("products")
    .select("*")
    .eq("hidden", false);

  if (error) console.error(error);
  else {
    products.value = data.sort((a, b) => a.sku.localeCompare(b.sku));
  }
});

const filteredProducts = computed(() => {
  if (selectedCategory.value === 0) return products.value;

  const selected = Number(selectedCategory.value);

  return products.value.filter((product) =>
    product.categories?.map(Number).includes(selected)
  );
});

const header = computed(() => {
  if (!selectedCategory.value) return "Wszystkie produkty";

  const selectedId = selectedCategory.value;
  const selected = categories.value.find((e) => e.id === selectedId);

  return selected.display_name;
});
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.products-page {
  max-width: 1200px;
  margin: 0 auto;

  .title {
    font-size: 22px;
    margin-bottom: 30px;
    text-align: left;
    color: #333;
    text-transform: capitalize;
    @media (min-width: 768px) {
margin-top: 30px;
    font-size: 24px;

    }
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
      height: 240px;
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

.mobile-filters-btn { 
  display: none;
}

.products-page {
  display: flex;
  gap: 30px;
  max-width: 1300px;
  margin: 0 auto;

  /* PRODUCT LIST RIGHT SIDE */
  .products-wrapper {
    flex: 1;
  }
}

/* ---------- MOBILE ---------- */
@media (max-width: 768px) {
  .products-page {
    flex-direction: column;
  }

  /* Przycisk na mobile */
  .mobile-filters-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 30px;
    right: 20px;
    width: 90px;
    padding: 8px;
    background: #32aa27;
    color: #fff;
    font-weight: 600;
    border-radius: 50px;
    font-size: 16px;
    border: none;
  }

}
</style>
