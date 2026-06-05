<template>
  <div class="status-grid">
    <div v-for="card in statusCards" :key="card.label" class="status-card">
      <v-icon :icon="card.icon" size="22" :color="card.color" />
      <div class="status-label">{{ card.label }}</div>
      <div class="status-count">{{ card.count }}</div>
      <div class="status-vs" :class="card.vs > 0 ? 'vs-up' : card.vs < 0 ? 'vs-down' : 'vs-neutral'">
        <v-icon :icon="card.vs > 0 ? 'mdi-arrow-up' : card.vs < 0 ? 'mdi-arrow-down' : 'mdi-minus'" size="12" />
        {{ Math.abs(card.vs) }} vs wczoraj
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ orders: { type: Array, default: () => [] } });

const { inWindow } = useOrderHelpers();

const now       = new Date();
const today     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const yesterday = new Date(today - 86400000);

const statusCards = computed(() => {
  const all = props.orders;
  const tod = all.filter(o => inWindow(o.created_at, today, now));
  const yes = all.filter(o => inWindow(o.created_at, yesterday, today));

  const cnt    = (arr, s) => arr.filter(o => s.includes(o.status)).length;
  const payCnt = (arr, s) => arr.filter(o => s.includes(o.payment_status)).length;

  return [
    { label: 'Oczekujące',    icon: 'mdi-clock-outline',         color: '#f59e0b', count: cnt(all,    ['pending_approval','awaiting_payment']), vs: cnt(tod, ['pending_approval','awaiting_payment']) - cnt(yes, ['pending_approval','awaiting_payment']) },
    { label: 'W realizacji',  icon: 'mdi-package-variant',        color: '#3b82f6', count: cnt(all,    ['processing']),  vs: cnt(tod, ['processing'])  - cnt(yes, ['processing']) },
    { label: 'Wysłane',       icon: 'mdi-truck-delivery-outline', color: '#8b5cf6', count: cnt(all,    ['shipped']),     vs: cnt(tod, ['shipped'])     - cnt(yes, ['shipped']) },
    { label: 'Przy odbiorze', icon: 'mdi-map-marker-outline',     color: '#10b981', count: payCnt(all, ['cod','paid_cod']), vs: payCnt(tod, ['cod','paid_cod']) - payCnt(yes, ['cod','paid_cod']) },
    { label: 'Zwrócone',      icon: 'mdi-refresh',                color: '#6b7280', count: cnt(all,    ['refunded']),   vs: cnt(tod, ['refunded'])    - cnt(yes, ['refunded']) },
  ];
});
</script>

<style scoped lang="scss">
.status-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 900px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 500px) { grid-template-columns: repeat(2, 1fr); }
}

.status-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-label { font-size: 12px; color: #6b7280; }
.status-count { font-size: 22px; font-weight: 700; color: #111; }

.status-vs {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 500;

  &.vs-up      { color: #10b981; }
  &.vs-down    { color: #ef4444; }
  &.vs-neutral { color: #9ca3af; }
}
</style>
