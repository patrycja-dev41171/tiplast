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
      <ProductList :products="filteredProducts" />
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
}

.mobile-filters-btn { 
  display: none;
}

.products-page {
  display: flex;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;

  .products-wrapper {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .products-page {
    flex-direction: column;
  }

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
