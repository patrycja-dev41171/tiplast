<template>
<div 
  v-if="mobileFiltersOpen" 
  class="filters-backdrop"
  @click="$emit('close')"
></div>
 <aside class="filters-panel" :class="{ open: mobileFiltersOpen }">
    <h3>Filtruj po kategorii:</h3>

    <NuxtLink to="/produkty" class="filter-option" @click="$emit('close')">
      <input type="checkbox" :checked="!activeSlug" tabindex="-1" aria-hidden="true" />
      Wszystkie
    </NuxtLink>

    <NuxtLink
      v-for="cat in categories"
      :key="cat.id"
      :to="`/produkty/${cat.slug}`"
      class="filter-option"
      @click="$emit('close')"
    >
      <input type="checkbox" :checked="activeSlug === cat.slug" tabindex="-1" aria-hidden="true" />
      {{ cat.display_name }}
    </NuxtLink>

    <div v-if="priceBounds[1] > priceBounds[0]" class="filter-group">
      <h3>Cena:</h3>
      <v-range-slider
        v-model="priceDraft"
        :min="priceBounds[0]"
        :max="priceBounds[1]"
        :step="0.1"
        color="#32aa27"
        track-color="#ccc"
        thumb-size="16"
        hide-details
        strict
        @end="$emit('update-price', $event)"
      />
      <p class="price-values">{{ formatPrice(priceDraft[0]) }} – {{ formatPrice(priceDraft[1]) }}</p>
    </div>

    <div v-if="colorOptions.length" class="filter-group">
      <h3>Kolor:</h3>
      <label v-for="color in colorOptions" :key="color.name" class="filter-option">
        <input
          type="checkbox"
          class="color-checkbox"
          :checked="selectedColors.includes(color.name)"
          @change="$emit('toggle-color', color.name)"
        />
        <span class="color-dot" :style="{ backgroundColor: color.value }"></span>
        <span class="color-name">{{ color.name }}</span>
        <span class="count">({{ color.count }})</span>
      </label>
    </div>

    <button v-if="hasActiveFilters" class="reset-filters" @click="$emit('reset')">
      Wyczyść filtry
    </button>

    <button class="close-filters" @click="$emit('close')">
      Pokaż wyniki ({{ productsCount }})
    </button>
  </aside>
</template>

<script setup>
const props = defineProps({
  categories: Array,
  activeSlug: String,
  mobileFiltersOpen: Boolean,
  productsCount: Number,
  colorOptions: { type: Array, default: () => [] },
  selectedColors: { type: Array, default: () => [] },
  priceBounds: { type: Array, default: () => [0, 0] },
  priceRange: { type: Array, default: () => [0, 0] },
  hasActiveFilters: Boolean,
});

defineEmits(["close", "toggle-color", "update-price", "reset"]);

// Lokalna kopia zakresu – suwak przesuwa się płynnie, a filtr zmienia się po puszczeniu
const priceDraft = ref([...props.priceRange]);
watch(() => props.priceRange, (range) => (priceDraft.value = [...range]));

const formatPrice = (value) => `${value.toFixed(2).replace(".", ",")} zł`;
</script>

<style scoped>

.filters-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  z-index: 9990;
  @media (min-width: 768px) {
    display: none !important;
  }}


.filters-panel {
  display: none;

  &.open {
    display: block;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
   background: #f5f5f5;
    padding: 30px 24px 40px;
    box-shadow: 0 -6px 500px rgba(0, 0, 0, 0.45);
    animation: slideUp 0.3s ease-out;
    overflow-y: auto;
    max-height: 85vh;
    height: auto;
    z-index: 9999;
  }

  h3 {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #222;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 16px;
    color: #333;
    text-decoration: none;

    &:hover {
      color: #32aa27;
    }

    input[type="checkbox"] {
      flex-shrink: 0;
      pointer-events: none;
      accent-color: #32aa27;
      width: 20px;
      height: 20px;
      margin: 0;
    }
  }
}

.filter-group {
  margin-top: 28px;

  .filter-option {
    cursor: pointer;
    font-size: 15px;
  }

  .color-checkbox {
    pointer-events: auto !important;
    cursor: pointer;
  }

  .color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #bbb;
    flex-shrink: 0;
    margin-left: -4px;
  }

  .color-name::first-letter {
    text-transform: uppercase;
  }

  .count {
    color: #888;
    font-size: 14px;
    margin-left: -6px;
  }

  .price-values {
    font-size: 15px;
    color: #333;
    margin-top: 4px;
  }
}

.reset-filters {
  margin-top: 8px;
  padding: 0;
  border: none;
  background: none;
  color: #32aa27;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  text-decoration: underline;
}

.close-filters {
  display: flex;
  justify-content: center;
  width: 100%;
  background: #32aa27;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
  border-radius: 4px;
  margin-top: 50px;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  .filters-panel {
    display: block;
    position: sticky;
    top: 100px;
    width: 260px;
    height: fit-content;
    padding: 24px;
    border: 1px solid #ddd;
    background: #fafafaa3;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    animation: none;
    margin-top: 95px;
  }

  .filter-group {
  margin-top: 28px;

  .filter-option {
    cursor: pointer;
    font-size: 15px;
  }

  .color-checkbox {
    pointer-events: auto !important;
    cursor: pointer;
  }

  .color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #bbb;
    flex-shrink: 0;
    margin-left: -4px;
  }

  .color-name::first-letter {
    text-transform: uppercase;
  }

  .count {
    color: #888;
    font-size: 14px;
    margin-left: -6px;
  }

  .price-values {
    font-size: 15px;
    color: #333;
    margin-top: 4px;
  }
}

.reset-filters {
  margin-top: 8px;
  padding: 0;
  border: none;
  background: none;
  color: #32aa27;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  text-decoration: underline;
}

.close-filters {
    display: none;
  }
}
</style>
