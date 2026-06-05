<template>
  <div class="chart-card">
    <div class="chart-header">
      <span class="chart-title">Sprzedaż w ostatnich 30 dniach</span>
      <div class="chart-toggle">
        <button :class="{ active: mode === 'revenue' }" @click="mode = 'revenue'">Przychód</button>
        <button :class="{ active: mode === 'count' }" @click="mode = 'count'">Liczba zamówień</button>
      </div>
    </div>
    <ClientOnly>
      <apexchart type="area" height="240" :options="chartOptions" :series="chartSeries" />
    </ClientOnly>
  </div>
</template>

<script setup>
const props = defineProps({ orders: { type: Array, default: () => [] } });

const { orderTotal, inWindow, fmtMoney } = useOrderHelpers();

const mode  = ref('revenue');
const now   = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const fmtChartDate = (d) => d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });

const chartDays = computed(() => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const from = new Date(today - i * 86400000);
    const to   = new Date(from.getTime() + 86400000);
    const day  = props.orders.filter(o => inWindow(o.created_at, from, to));
    days.push({
      label:   fmtChartDate(from),
      revenue: Math.round(day.reduce((s, o) => s + orderTotal(o), 0)),
      count:   day.length,
    });
  }
  return days;
});

const chartSeries = computed(() => [{
  name: mode.value === 'revenue' ? 'Przychód' : 'Liczba zamówień',
  data: chartDays.value.map(d => mode.value === 'revenue' ? d.revenue : d.count),
}]);

const chartOptions = computed(() => ({
  chart:       { type: 'area', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
  dataLabels:  { enabled: false },
  stroke:      { curve: 'smooth', width: 2, colors: ['#32ab27'] },
  fill:        { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 100] }, colors: ['#32ab27'] },
  xaxis: {
    categories: chartDays.value.map(d => d.label),
    tickAmount: 6,
    labels:     { style: { fontSize: '11px', colors: Array(30).fill('#9ca3af') }, rotate: 0 },
    axisBorder: { show: false },
    axisTicks:  { show: false },
  },
  yaxis: {
    labels: {
      style:     { fontSize: '11px', colors: ['#9ca3af'] },
      formatter: (v) => mode.value === 'revenue' ? `${v.toLocaleString('pl-PL')} zł` : String(v),
    },
  },
  grid:    { borderColor: '#f3f4f6', strokeDashArray: 4, padding: { top: 0 } },
  tooltip: { theme: 'light', y: { formatter: (v) => mode.value === 'revenue' ? fmtMoney(v) : `${v} zamówień` } },
}));
</script>

<style scoped lang="scss">
.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 20px 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  margin-bottom: 16px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.chart-title { font-size: 15px; font-weight: 600; color: #111; }

.chart-toggle {
  display: flex;
  gap: 6px;

  button {
    padding: 5px 14px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background: #fff;
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s;

    &.active          { background: #111; color: #fff; border-color: #111; }
    &:hover:not(.active) { background: #f9fafb; }
  }
}
</style>
