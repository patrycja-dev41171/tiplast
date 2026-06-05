<template>
  <div class="stats-grid">
    <div v-for="card in cards" :key="card.key" class="stat-card">
      <div class="stat-top">
        <div>
          <div class="stat-label">{{ card.label }}</div>
          <div class="stat-value">{{ card.display }}</div>
          <div class="stat-pct" :class="card.pctPositive ? 'up' : 'down'">
            <v-icon :icon="card.pctPositive ? 'mdi-trending-up' : 'mdi-trending-down'" size="14" />
            {{ Math.abs(card.pct) }}% vs poprzednie 30 dni
          </div>
        </div>
        <v-icon :icon="card.icon" size="28" class="stat-icon" :color="card.color" />
      </div>
      <ClientOnly>
        <apexchart type="line" height="50" :options="sparkOpts(card.color)" :series="buildSparkline(card.key)" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ orders: { type: Array, default: () => [] } });

const { orderTotal, inWindow } = useOrderHelpers();
const { fmtMoney } = useOrderHelpers();

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const last30Start = new Date(today - 30 * 86400000);
const prev30Start = new Date(today - 60 * 86400000);

const pct = (curr, prev) => {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
};

const last30 = computed(() => props.orders.filter(o => inWindow(o.created_at, last30Start, now)));
const prev30 = computed(() => props.orders.filter(o => inWindow(o.created_at, prev30Start, last30Start)));

const stats = computed(() => {
  const rev30 = last30.value.reduce((s, o) => s + orderTotal(o), 0);
  const revP  = prev30.value.reduce((s, o) => s + orderTotal(o), 0);
  const can30 = last30.value.filter(o => o.status === 'cancelled').length;
  const canP  = prev30.value.filter(o => o.status === 'cancelled').length;
  const avg30 = last30.value.length ? rev30 / last30.value.length : 0;
  const avgP  = prev30.value.length ? revP / prev30.value.length : 0;
  return {
    count:     { value: last30.value.length, pct: pct(last30.value.length, prev30.value.length) },
    revenue:   { value: rev30,  pct: pct(rev30, revP) },
    avg:       { value: avg30,  pct: pct(avg30, avgP) },
    cancelled: { value: can30,  pct: pct(can30, canP) },
  };
});

const cards = computed(() => [
  { key: 'count',     label: 'Zamówienia',   display: stats.value.count.value,           pct: stats.value.count.pct,     pctPositive: stats.value.count.pct >= 0,     icon: 'mdi-cart-variant',        color: '#3b82f6' },
  { key: 'revenue',   label: 'Przychód',     display: fmtMoney(stats.value.revenue.value), pct: stats.value.revenue.pct, pctPositive: stats.value.revenue.pct >= 0,   icon: 'mdi-cash-multiple',       color: '#10b981' },
  { key: 'avg',       label: 'Średni koszyk',display: fmtMoney(stats.value.avg.value),    pct: stats.value.avg.pct,      pctPositive: stats.value.avg.pct >= 0,       icon: 'mdi-chart-line',          color: '#f59e0b' },
  { key: 'cancelled', label: 'Anulowane',    display: stats.value.cancelled.value,        pct: stats.value.cancelled.pct,pctPositive: stats.value.cancelled.pct <= 0, icon: 'mdi-close-circle-outline',color: '#ef4444' },
]);

const buildSparkline = (key) => {
  const result = [];
  for (let i = 13; i >= 0; i--) {
    const from = new Date(today - i * 86400000);
    const to   = new Date(from.getTime() + 86400000);
    const day  = props.orders.filter(o => inWindow(o.created_at, from, to));
    if (key === 'revenue')   result.push(Math.round(day.reduce((s, o) => s + orderTotal(o), 0)));
    if (key === 'count')     result.push(day.length);
    if (key === 'cancelled') result.push(day.filter(o => o.status === 'cancelled').length);
    if (key === 'avg')       result.push(day.length ? Math.round(day.reduce((s, o) => s + orderTotal(o), 0) / day.length) : 0);
  }
  return [{ data: result }];
};

const sparkOpts = (color) => ({
  chart: { type: 'line', sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2, colors: [color] },
  tooltip: { enabled: false },
});
</script>

<style scoped lang="scss">
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 18px 18px 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  overflow: hidden;
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.stat-label  { font-size: 13px; color: #6b7280; margin-bottom: 4px; }
.stat-value  { font-size: 24px; font-weight: 700; color: #111; line-height: 1.1; }
.stat-icon   { opacity: 0.85; }

.stat-pct {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;

  &.up   { color: #10b981; }
  &.down { color: #ef4444; }
}
</style>
