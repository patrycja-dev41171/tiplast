<template>
  <div class="page-header">
    <h1>Zamówienia</h1>
    <div class="header-actions">
      <button
        class="btn-toggle-stats"
        :title="showStats ? 'Ukryj statystyki' : 'Pokaż statystyki'"
        @click="$emit('toggle-stats')"
      >
        <v-icon :icon="showStats ? 'mdi-chart-bar-stacked' : 'mdi-chart-bar'" size="18" />
        <span>{{ showStats ? 'Ukryj statystyki' : 'Pokaż statystyki' }}</span>
      </button>
      <NuxtLink to="/admin/order/add" class="btn-add">
        <v-icon icon="mdi-plus" size="18" />Dodaj zamówienie
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({ showStats: { type: Boolean, default: true } });
defineEmits(['toggle-stats']);
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  h1 { font-size: 26px; font-weight: 700; color: #111; }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-toggle-stats {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover { background: #f9fafb; border-color: #d1d5db; }

  @media (max-width: 500px) { span { display: none; } }
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #32ab27;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.15s;

  &:hover { background: #27891e; }
}
</style>
