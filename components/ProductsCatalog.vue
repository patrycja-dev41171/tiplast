<template>
  <div class="products-page pa-6">
    <!-- LEWA KOLUMNA – FILTRY -->
    <CategoryFilters
      :categories="categories"
      :activeSlug="activeSlug"
      :mobileFiltersOpen="mobileFiltersOpen"
      :productsCount="filteredProducts.length"
      :colorOptions="colorOptions"
      :selectedColors="selectedColors"
      :priceBounds="priceBounds"
      :priceRange="priceRange"
      :hasActiveFilters="hasActiveFilters"
      @close="mobileFiltersOpen = false"
      @toggle-color="toggleColor"
      @update-price="updatePrice"
      @reset="resetFilters"
    />

    <!-- MOBILE BUTTON -->
    <button class="mobile-filters-btn" @click="mobileFiltersOpen = true">
      Filtruj <v-icon color="#fff" icon="mdi-filter-menu-outline" class="mx-1" size="small"></v-icon>
    </button>

    <!-- PRAWA KOLUMNA – PRODUKTY -->
    <div class="products-wrapper">
      <h1 class="title">{{ heading }}</h1>

      <p v-if="products.length === 0" class="empty">Brak produktów w tej kategorii.</p>
      <div v-else-if="filteredProducts.length === 0" class="empty">
        <p>Brak produktów spełniających wybrane kryteria.</p>
        <button class="reset-btn" @click="resetFilters">Wyczyść filtry</button>
      </div>
      <ProductList :products="filteredProducts" />

      <section v-if="subheading || intro.length" class="content-section">
        <h2 v-if="subheading">{{ subheading }}</h2>
        <p v-for="(paragraph, i) in intro" :key="`intro-${i}`">{{ paragraph }}</p>
      </section>

      <section v-for="(section, i) in sections" :key="`section-${i}`" class="content-section">
        <h2>{{ section.title }}</h2>
        <p v-for="(paragraph, j) in section.paragraphs" :key="j">{{ paragraph }}</p>
      </section>

      <section v-if="faq.length" class="content-section">
        <h2 class="mb-6">FAQ - Najczęściej zadawane pytania</h2>
        <FaqList :items="faq" />
      </section>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: { type: Array, default: () => [] },
  products: { type: Array, default: () => [] },
  colors: { type: Array, default: () => [] },
  activeSlug: { type: String, default: "" },
  heading: { type: String, required: true },
  subheading: { type: String, default: "" },
  intro: { type: Array, default: () => [] },
  sections: { type: Array, default: () => [] },
  faq: { type: Array, default: () => [] },
});

const mobileFiltersOpen = ref(false);

const route = useRoute();
const router = useRouter();

const toPrice = (value) => Number((value || "0").toString().replace(",", "."));

const hexToRgb = (hex) => {
  const value = parseInt((hex || "").replace("#", ""), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

// Kolor produktu to hex, nie zawsze identyczny z tym w tabeli "colors"
// (np. #b83204 zamiast #b83104), więc bierzemy najbliższy kolor ze słownika.
const colorName = (hex) => {
  if (!hex || !props.colors.length) return null;
  const exact = props.colors.find((c) => c.value.toLowerCase() === hex.toLowerCase());
  if (exact) return exact.display_name;

  const [r, g, b] = hexToRgb(hex);
  let nearest = null;
  let nearestDistance = Infinity;
  for (const c of props.colors) {
    const [cr, cg, cb] = hexToRgb(c.value);
    const distance = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
    if (distance < nearestDistance) {
      nearest = c;
      nearestDistance = distance;
    }
  }
  return nearest?.display_name || null;
};

const items = computed(() =>
  props.products.map((product) => ({
    product,
    price: toPrice(product.prices?.pln?.base_price),
    color: colorName(product.color),
  }))
);

// Kolory dostępne w bieżącej kategorii, z liczbą produktów
const colorOptions = computed(() => {
  const options = new Map();
  for (const item of items.value) {
    if (!item.color) continue;
    const option = options.get(item.color);
    if (option) option.count++;
    else {
      const color = props.colors.find((c) => c.display_name === item.color);
      options.set(item.color, { name: item.color, value: color?.value, count: 1 });
    }
  }
  return [...options.values()].sort((a, b) => b.count - a.count);
});

const priceBounds = computed(() => {
  const prices = items.value.map((item) => item.price);
  if (!prices.length) return [0, 0];
  return [Math.floor(Math.min(...prices) * 10) / 10, Math.ceil(Math.max(...prices) * 10) / 10];
});

// Filtry trzymamy w adresie: ?kolor=czarny,biały&cena=0.5-2
const selectedColors = computed(() =>
  (route.query.kolor || "").toString().split(",").filter(Boolean)
);

const priceRange = computed(() => {
  const [min, max] = priceBounds.value;
  const [from, to] = (route.query.cena || "").toString().split("-").map(Number);
  return [
    Number.isFinite(from) && route.query.cena ? Math.max(from, min) : min,
    Number.isFinite(to) && route.query.cena ? Math.min(to, max) : max,
  ];
});

const hasActiveFilters = computed(() => !!route.query.kolor || !!route.query.cena);

const filteredProducts = computed(() => {
  const [from, to] = priceRange.value;
  return items.value
    .filter((item) => item.price >= from - 0.001 && item.price <= to + 0.001)
    .filter((item) => !selectedColors.value.length || selectedColors.value.includes(item.color))
    .map((item) => item.product);
});

const setQuery = (patch) => {
  const query = { ...route.query, ...patch };
  Object.keys(query).forEach((key) => !query[key] && delete query[key]);
  router.replace({ query });
};

const toggleColor = (name) => {
  const colors = selectedColors.value.includes(name)
    ? selectedColors.value.filter((c) => c !== name)
    : [...selectedColors.value, name];
  setQuery({ kolor: colors.join(",") });
};

const updatePrice = ([from, to]) => {
  const [min, max] = priceBounds.value;
  const isFullRange = from <= min && to >= max;
  setQuery({ cena: isFullRange ? "" : `${from}-${to}` });
};

const resetFilters = () => setQuery({ kolor: "", cena: "" });
</script>

<style scoped lang="scss">
.products-page {
  display: flex;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;

  .products-wrapper {
    flex: 1;
    min-width: 0;
  }

  .title {
    font-size: 22px;
    margin-bottom: 30px;
    text-align: left;
    color: #333;

    @media (min-width: 768px) {
      margin-top: 30px;
      font-size: 24px;
    }
  }

  .empty {
    color: #555;
    margin-bottom: 20px;
  }

  .reset-btn {
    margin-top: 12px;
    padding: 8px 18px;
    border: 1px solid #32aa27;
    border-radius: 4px;
    color: #32aa27;
    font-weight: 600;
    background: #fff;
    cursor: pointer;
  }

  .content-section {
    margin-top: 50px;

    h2 {
      font-size: 20px;
      color: #333;
      margin-bottom: 10px;
    }

    p {
      color: #555;
      line-height: 1.6;
      margin-bottom: 10px;
    }
  }
}

.mobile-filters-btn {
  display: none;
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
    z-index: 10;
  }
}
</style>
