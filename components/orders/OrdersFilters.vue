<template>
  <div class="filters-bar">
    <div class="search-wrap">
      <v-icon icon="mdi-magnify" size="18" class="search-icon" />
      <input
        :value="searchQuery"
        class="search-input"
        placeholder="Szukaj zamówienia, klienta, e-mail..."
        @input="$emit('update:searchQuery', $event.target.value)"
      />
    </div>
    <select :value="statusFilter" class="filter-select" @change="$emit('update:statusFilter', $event.target.value)">
      <option value="all">Status: Wszystkie</option>
      <option v-for="s in allStatuses" :key="s.value" :value="s.value">{{ s.label }}</option>
    </select>
    <select :value="paymentFilter" class="filter-select" @change="$emit('update:paymentFilter', $event.target.value)">
      <option value="all">Płatność: Wszystkie</option>
      <option v-for="p in allPayments" :key="p.value" :value="p.value">{{ p.label }}</option>
    </select>
    <input :value="dateFrom" type="date" class="filter-date" @change="$emit('update:dateFrom', $event.target.value)" />
    <input :value="dateTo"   type="date" class="filter-date" @change="$emit('update:dateTo',   $event.target.value)" />
    <button class="btn-export" @click="$emit('export')">
      <v-icon icon="mdi-download-outline" size="16" />Eksportuj CSV
    </button>
  </div>
</template>

<script setup>
defineProps({
  searchQuery:   { type: String,  default: '' },
  statusFilter:  { type: String,  default: 'all' },
  paymentFilter: { type: String,  default: 'all' },
  dateFrom:      { type: String,  default: '' },
  dateTo:        { type: String,  default: '' },
  allStatuses:   { type: Array,   default: () => [] },
  allPayments:   { type: Array,   default: () => [] },
});
defineEmits(['update:searchQuery','update:statusFilter','update:paymentFilter','update:dateFrom','update:dateTo','export']);
</script>

<style scoped lang="scss">
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
  align-items: center;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 220px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 9px 12px 9px 34px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;

  &:focus { border-color: #32ab27; }
}

.filter-select,
.filter-date {
  padding: 9px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  color: #374151;
  outline: none;
  cursor: pointer;

  &:focus { border-color: #32ab27; }
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover { background: #f9fafb; }
}
</style>
