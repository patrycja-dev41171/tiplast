<template>
<div 
  v-if="mobileFiltersOpen" 
  class="filters-backdrop"
  @click="$emit('close')"
></div>
 <aside class="filters-panel" :class="{ open: mobileFiltersOpen }">
    <h3>Filtruj po kategorii:</h3>

    <label class="filter-option">
      <input
        type="checkbox"
        :checked="selectedCategory === 0"
        @change="toggleCategory(0)"
      />
      Wszystkie
    </label>

    <label v-for="cat in categories" :key="cat.id" class="filter-option">
      <input
        type="checkbox"
        :checked="selectedCategory === cat.id"
        @change="toggleCategory(cat.id)"
      />
      {{ cat.display_name }}
    </label>

    <button class="close-filters" @click="$emit('close')">
      Pokaż wyniki ({{ productsCount }})
    </button>
  </aside>
</template>

<script setup>
const props = defineProps({
  categories: Array,
  selectedCategory: Number,
  mobileFiltersOpen: Boolean,
  productsCount: Number,
});

const emit = defineEmits(["update:selectedCategory", "close"]);

const toggleCategory = (id) => {
  const newValue = props.selectedCategory === id ? 0 : id;
  emit("update:selectedCategory", newValue);
};
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

    input[type="checkbox"] {
      accent-color: #32aa27;
      width: 20px;
      height: 20px;
      margin: 0;
      cursor: pointer;
    }
  }
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

  .close-filters {
    display: none;
  }
}
</style>
