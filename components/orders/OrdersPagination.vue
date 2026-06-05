<template>
  <div v-if="totalPages > 1" class="pagination">
    <span class="pag-info">{{ rangeFrom }}–{{ rangeTo }} z {{ total }}</span>
    <div class="pag-controls">
      <button class="pag-btn" :disabled="currentPage === 1" @click="$emit('update:currentPage', currentPage - 1)">
        <v-icon icon="mdi-chevron-left" size="18" />
      </button>
      <button
        v-for="n in pageNums"
        :key="n"
        class="pag-btn"
        :class="{ active: n === currentPage }"
        @click="$emit('update:currentPage', n)"
      >
        {{ n }}
      </button>
      <span v-if="totalPages > 3 && currentPage < totalPages - 1" class="pag-dots">…</span>
      <button v-if="totalPages > 3 && currentPage < totalPages" class="pag-btn" @click="$emit('update:currentPage', totalPages)">
        {{ totalPages }}
      </button>
      <button class="pag-btn" :disabled="currentPage === totalPages" @click="$emit('update:currentPage', currentPage + 1)">
        <v-icon icon="mdi-chevron-right" size="18" />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  totalPages:  { type: Number, required: true },
  pageNums:    { type: Array,  required: true },
  rangeFrom:   { type: Number, required: true },
  rangeTo:     { type: Number, required: true },
  total:       { type: Number, required: true },
});
defineEmits(['update:currentPage']);
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px 0;
}

.pag-info { font-size: 13px; color: #6b7280; }

.pag-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pag-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover:not(:disabled) { background: #f3f4f6; }
  &:disabled             { opacity: 0.4; cursor: default; }
  &.active               { background: #32ab27; color: #fff; border-color: #32ab27; }
}

.pag-dots { color: #9ca3af; font-size: 13px; }
</style>
