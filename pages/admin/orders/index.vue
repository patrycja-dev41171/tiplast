<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin-client' });

const { getOrders, deleteOrder } = useOrder();
const { orderTotal, getClientName } = useOrderHelpers();

const orders  = ref([]);
const loading = ref(true);
const fetchError = ref(null);

// toggle stats
const showStats = ref(true);
watch(showStats, (v) => localStorage.setItem('orders_show_stats', String(v)));

// filters
const searchQuery   = ref('');
const statusFilter  = ref('all');
const paymentFilter = ref('all');
const dateFrom      = ref('');
const dateTo        = ref('');

// pagination
const currentPage = ref(1);
const PER_PAGE    = 10;

onMounted(async () => {
  const saved = localStorage.getItem('orders_show_stats');
  if (saved !== null) showStats.value = saved === 'true';
  try {
    orders.value = await getOrders() ?? [];
  } catch (e) {
    fetchError.value = e?.message ?? 'Błąd podczas ładowania zamówień';
    console.error('[orders]', e);
  } finally {
    loading.value = false;
  }
});

// filter options
const allStatuses = computed(() => {
  const s = new Set(orders.value.map(o => o.status));
  return [...s].map(v => ({ value: v, label: getOrderStatusMeta(v).label }));
});

const allPayments = computed(() => {
  const s = new Set(orders.value.map(o => o.payment_status));
  return [...s].map(v => ({ value: v, label: getPaymentStatusMeta(v).label }));
});

// filtered list
const filteredOrders = computed(() => {
  let r = orders.value;
  const q = searchQuery.value.toLowerCase();
  if (q) r = r.filter(o =>
    o.order_number?.toLowerCase().includes(q) ||
    o.email?.toLowerCase().includes(q) ||
    `${o.first_name || ''} ${o.last_name || ''}`.toLowerCase().includes(q)
  );
  if (statusFilter.value  !== 'all') r = r.filter(o => o.status         === statusFilter.value);
  if (paymentFilter.value !== 'all') r = r.filter(o => o.payment_status === paymentFilter.value);
  if (dateFrom.value) r = r.filter(o => new Date(o.created_at) >= new Date(dateFrom.value));
  if (dateTo.value)   {
    const to = new Date(dateTo.value); to.setHours(23, 59, 59);
    r = r.filter(o => new Date(o.created_at) <= to);
  }
  return r;
});

watch([searchQuery, statusFilter, paymentFilter, dateFrom, dateTo], () => { currentPage.value = 1; });

// pagination
const totalPages     = computed(() => Math.ceil(filteredOrders.value.length / PER_PAGE));
const pageNums       = computed(() => {
  const pages = [];
  for (let i = Math.max(1, currentPage.value - 1); i <= Math.min(totalPages.value, currentPage.value + 1); i++) pages.push(i);
  return pages;
});
const paginatedOrders = computed(() => {
  const s = (currentPage.value - 1) * PER_PAGE;
  return filteredOrders.value.slice(s, s + PER_PAGE);
});

const onDeleteOrder = async (orderId) => {
  try {
    await deleteOrder(orderId);
    orders.value = orders.value.filter(o => o.order_id !== orderId);
  } catch (e) {
    console.error('[deleteOrder]', e);
  }
};

// export csv
const exportCSV = () => {
  const headers = ['Nr zamówienia', 'Klient', 'Email', 'Data', 'Status', 'Płatność', 'Wartość'];
  const rows = filteredOrders.value.map(o => [
    o.order_number, getClientName(o), o.email,
    formatDate(o.created_at),
    getOrderStatusMeta(o.status).label,
    getPaymentStatusMeta(o.payment_status).label,
    orderTotal(o).toFixed(2),
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(';')).join('\n');
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })),
    download: 'zamowienia.csv',
  });
  a.click();
};
</script>

<template>
  <div class="orders-page">

    <OrdersHeader :show-stats="showStats" @toggle-stats="showStats = !showStats" />

    <div v-if="loading" class="loading">Ładowanie...</div>
    <div v-else-if="fetchError" class="error">{{ fetchError }}</div>

    <template v-else>

      <Transition name="stats-fade">
        <div v-if="showStats">
          <OrdersStatsGrid  :orders="orders" />
          <OrdersStatusGrid :orders="orders" />
          <OrdersChart      :orders="orders" />
        </div>
      </Transition>

      <OrdersFilters
        v-model:search-query="searchQuery"
        v-model:status-filter="statusFilter"
        v-model:payment-filter="paymentFilter"
        v-model:date-from="dateFrom"
        v-model:date-to="dateTo"
        :all-statuses="allStatuses"
        :all-payments="allPayments"
        @export="exportCSV"
      />

      <OrdersTable        :orders="paginatedOrders" @delete="onDeleteOrder" />
      <OrdersMobileCards  :orders="paginatedOrders" />

      <OrdersPagination
        v-model:current-page="currentPage"
        :total-pages="totalPages"
        :page-nums="pageNums"
        :range-from="(currentPage - 1) * PER_PAGE + 1"
        :range-to="Math.min(currentPage * PER_PAGE, filteredOrders.length)"
        :total="filteredOrders.length"
      />

    </template>
  </div>
</template>

<style scoped lang="scss">
.orders-page {
  padding: 28px 32px;
  max-width: 1400px;

  @media (max-width: 768px) { padding: 16px; }
}

.loading { padding: 40px; text-align: center; color: #9ca3af; }
.error   { padding: 40px; text-align: center; color: #ef4444; }

.stats-fade-enter-active,
.stats-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.stats-fade-enter-from,
.stats-fade-leave-to     { opacity: 0; transform: translateY(-6px); }
</style>
