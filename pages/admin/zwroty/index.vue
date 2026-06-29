<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin-client' });

const { $supabase } = useNuxtApp();

const withdrawals = ref([]);
const loading     = ref(true);
const fetchError  = ref('');

// ── Filtry ────────────────────────────────────────────────────────────────────
const searchQuery  = ref('');
const statusFilter = ref('all');
const currentPage  = ref(1);
const PER_PAGE     = 15;

const STATUSES = [
  { value: 'pending',   label: 'Oczekujące',    color: '#f59e0b' },
  { value: 'confirmed', label: 'Zatwierdzone',   color: '#3b82f6' },
  { value: 'completed', label: 'Zakończone',     color: '#22c55e' },
  { value: 'rejected',  label: 'Odrzucone',      color: '#ef4444' },
];

const statusMeta = (s) => STATUSES.find(x => x.value === s) ?? { label: s, color: '#9ca3af' };
const hexAlpha = (hex, a) => { const h = hex.replace('#','').slice(0,6); return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`; };
const badgeStyle = (color) => ({ color: '#' + color.replace('#','').slice(0,6), background: hexAlpha(color, 0.1), border: `1px solid ${hexAlpha(color, 0.25)}` });

// ── Fetch ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  const { data, error } = await $supabase
    .from('withdrawal_requests')
    .select('*')
    .order('created_at', { ascending: false });

  loading.value = false;
  if (error) { fetchError.value = error.message; return; }
  withdrawals.value = data ?? [];
});

// ── Filtrowanie ───────────────────────────────────────────────────────────────
const filtered = computed(() => {
  let r = withdrawals.value;
  const q = searchQuery.value.toLowerCase();
  if (q) r = r.filter(w =>
    w.withdrawal_number?.toLowerCase().includes(q) ||
    w.order_number?.toLowerCase().includes(q) ||
    `${w.firstname} ${w.lastname}`.toLowerCase().includes(q) ||
    w.email?.toLowerCase().includes(q)
  );
  if (statusFilter.value !== 'all') r = r.filter(w => w.status === statusFilter.value);
  return r;
});

watch([searchQuery, statusFilter], () => { currentPage.value = 1; });

const totalPages     = computed(() => Math.ceil(filtered.value.length / PER_PAGE));
const paginated      = computed(() => filtered.value.slice((currentPage.value - 1) * PER_PAGE, currentPage.value * PER_PAGE));
const pageNums       = computed(() => {
  const pages = [];
  for (let i = Math.max(1, currentPage.value - 1); i <= Math.min(totalPages.value, currentPage.value + 1); i++) pages.push(i);
  return pages;
});

// ── Zmiana statusu ────────────────────────────────────────────────────────────
const updatingId = ref(null);

// Dialog odrzucenia
const rejectDialog       = ref(false);
const rejectTarget       = ref(null);
const rejectReason       = ref('');
const rejectReasonError  = ref(false);

const handleStatusClick = (w, status) => {
  if (status === 'rejected') {
    rejectTarget.value = w;
    rejectReason.value = '';
    rejectReasonError.value = false;
    rejectDialog.value = true;
  } else {
    updateStatus(w, status);
  }
};

const confirmReject = async () => {
  if (!rejectReason.value.trim()) { rejectReasonError.value = true; return; }
  rejectDialog.value = false;
  await updateStatus(rejectTarget.value, 'rejected', rejectReason.value.trim());
  rejectTarget.value = null;
};

const updateStatus = async (w, status, rejection_reason = null) => {
  updatingId.value = w.id;
  try {
    await $fetch('/api/withdrawal/update-status', {
      method: 'POST',
      body: { id: w.id, status, rejection_reason },
    });
    w.status = status;
    if (rejection_reason) w.rejection_reason = rejection_reason;
  } catch (err) {
    console.error('[zwroty] updateStatus error:', err);
  }
  updatingId.value = null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
const typeLabel = (t) => t === 'full' ? 'Całość' : 'Część';

// ── Szczegóły (rozwijany wiersz) ──────────────────────────────────────────────
const expanded = ref(null);
const toggle   = (id) => { expanded.value = expanded.value === id ? null : id; };
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Zwroty</h1>
        <p class="subtitle">Oświadczenia o odstąpieniu od umowy</p>
      </div>
      <div class="header-stats">
        <div class="stat" v-for="s in STATUSES" :key="s.value">
          <span class="stat-count" :style="{ color: s.color }">
            {{ withdrawals.filter(w => w.status === s.value).length }}
          </span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <!-- Filtry -->
    <div class="filters">
      <div class="search-wrap">
        <v-icon icon="mdi-magnify" size="18" class="search-icon" />
        <input v-model="searchQuery" placeholder="Szukaj po numerze, kliencie, e-mailu..." class="search-input" />
      </div>
      <div class="status-tabs">
        <button
          v-for="tab in [{ value: 'all', label: 'Wszystkie' }, ...STATUSES]"
          :key="tab.value"
          class="status-tab"
          :class="{ active: statusFilter === tab.value }"
          :style="statusFilter === tab.value && tab.color ? { borderColor: tab.color, color: tab.color } : {}"
          @click="statusFilter = tab.value"
        >
          {{ tab.label }}
          <span class="tab-count">{{ tab.value === 'all' ? withdrawals.length : withdrawals.filter(w => w.status === tab.value).length }}</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="state-msg">Ładowanie...</div>
    <div v-else-if="fetchError" class="state-msg error">{{ fetchError }}</div>
    <div v-else-if="!filtered.length" class="state-msg">Brak wyników</div>

    <!-- Tabela -->
    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Nr zwrotu</th>
            <th>Nr zamówienia</th>
            <th>Klient</th>
            <th>Data złożenia</th>
            <th>Zakres</th>
            <th>Status</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="w in paginated" :key="w.id">
            <tr :class="{ 'row-expanded': expanded === w.id }">
              <td class="col-number">
                <button class="expand-btn" @click="toggle(w.id)">
                  <v-icon :icon="expanded === w.id ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="16" />
                </button>
                <span class="withdrawal-num">{{ w.withdrawal_number ?? '—' }}</span>
              </td>
              <td class="col-order">
                <NuxtLink v-if="w.order_id" :to="`/admin/order/view/${w.order_id}`" class="order-link">
                  {{ w.order_number }}
                </NuxtLink>
                <span v-else>{{ w.order_number }}</span>
              </td>
              <td class="col-client">
                <div class="client-name">{{ w.firstname }} {{ w.lastname }}</div>
                <div class="client-email">{{ w.email }}</div>
              </td>
              <td class="col-date">{{ fmtDate(w.created_at) }}</td>
              <td>
                <span class="type-badge" :class="w.withdrawal_type">{{ typeLabel(w.withdrawal_type) }}</span>
              </td>
              <td>
                <span class="badge" :style="badgeStyle(statusMeta(w.status).color)">
                  {{ statusMeta(w.status).label }}
                </span>
              </td>
              <td class="col-actions">
                <v-menu>
                  <template #activator="{ props }">
                    <button class="action-btn" v-bind="props" :disabled="updatingId === w.id">
                      <v-icon icon="mdi-dots-vertical" size="18" />
                    </button>
                  </template>
                  <v-list density="compact" class="status-menu">
                    <v-list-subheader>Zmień status</v-list-subheader>
                    <v-list-item
                      v-for="s in STATUSES"
                      :key="s.value"
                      :disabled="w.status === s.value"
                      @click="handleStatusClick(w, s.value)"
                    >
                      <template #prepend>
                        <span class="menu-dot" :style="{ background: s.color }" />
                      </template>
                      {{ s.label }}
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>

            <!-- Rozwinięte szczegóły -->
            <tr v-if="expanded === w.id" class="detail-row">
              <td colspan="7">
                <div class="detail-grid">

                  <div class="detail-section">
                    <h4>Dane klienta</h4>
                    <p><strong>Imię i nazwisko:</strong> {{ w.firstname }} {{ w.lastname }}</p>
                    <p><strong>E-mail:</strong> {{ w.email }}</p>
                    <p><strong>Telefon:</strong> {{ w.phone }}</p>
                  </div>

                  <div class="detail-section">
                    <h4>Dane do zwrotu płatności</h4>
                    <p><strong>Nr rachunku:</strong> {{ w.bank_account }}</p>
                    <p><strong>Właściciel:</strong> {{ w.account_holder }}</p>
                  </div>

                  <div class="detail-section">
                    <h4>Powód zwrotu</h4>
                    <p>{{ w.reason || '— nie podano —' }}</p>
                  </div>

                  <div v-if="w.rejection_reason" class="detail-section detail-section--rejection">
                    <h4>Powód odrzucenia</h4>
                    <p>{{ w.rejection_reason }}</p>
                  </div>

                  <div class="detail-section detail-section--wide">
                    <h4>Zwracane produkty</h4>
                    <ul v-if="w.items?.length" class="items-list">
                      <li v-for="(item, i) in w.items" :key="i">
                        <strong>{{ item.name }}</strong>
                        <span class="item-sku">{{ item.sku }}</span>
                        <span class="item-qty">× {{ item.quantity }} szt.</span>
                      </li>
                    </ul>
                    <p v-else>—</p>
                  </div>

                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Dialog odrzucenia -->
    <v-dialog v-model="rejectDialog" max-width="480">
      <v-card class="reject-dialog">
        <v-card-title class="reject-dialog__title">
          <v-icon icon="mdi-close-circle-outline" color="#ef4444" size="20" style="margin-right:8px" />
          Odrzuć oświadczenie
        </v-card-title>
        <v-card-text>
          <p class="reject-dialog__subtitle">
            Podaj powód odrzucenia — zostanie przesłany do klienta e-mailem.
          </p>
          <label class="reject-label">Powód odrzucenia *</label>
          <textarea
            v-model="rejectReason"
            class="reject-textarea"
            :class="{ 'reject-textarea--error': rejectReasonError }"
            rows="4"
            placeholder="np. Towar nosi ślady użytkowania wykluczające odstąpienie od umowy..."
            @input="rejectReasonError = false"
          />
          <p v-if="rejectReasonError" class="reject-error">Powód odrzucenia jest wymagany.</p>
        </v-card-text>
        <v-card-actions class="reject-dialog__actions">
          <button class="btn-cancel" @click="rejectDialog = false">Anuluj</button>
          <button class="btn-reject" @click="confirmReject">Odrzuć i wyślij e-mail</button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Paginacja -->
    <div v-if="totalPages > 1" class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--" class="page-btn">
        <v-icon icon="mdi-chevron-left" size="18" />
      </button>
      <button
        v-for="n in pageNums" :key="n"
        class="page-btn" :class="{ active: n === currentPage }"
        @click="currentPage = n"
      >{{ n }}</button>
      <button :disabled="currentPage === totalPages" @click="currentPage++" class="page-btn">
        <v-icon icon="mdi-chevron-right" size="18" />
      </button>
      <span class="page-info">{{ filtered.length }} wyników</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  padding: 28px 32px;
  max-width: 1400px;
  @media (max-width: 768px) { padding: 16px; }
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;

  h1 { font-size: 24px; font-weight: 700; color: #111; }
  .subtitle { font-size: 13px; color: #9ca3af; margin-top: 2px; }
}

.header-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-count { font-size: 22px; font-weight: 700; line-height: 1; }
.stat-label { font-size: 11px; color: #9ca3af; }

// ── Filtry ────────────────────────────────────────────────────────────────────
.filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.search-wrap {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  &:focus { border-color: #32aa27; }
}

.status-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.status-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #fff;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;

  &.active { font-weight: 600; background: #f9fafb; }
  &:hover:not(.active) { background: #f9fafb; }
}

.tab-count {
  background: #f3f4f6;
  color: #374151;
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 11px;
}

// ── Tabela ────────────────────────────────────────────────────────────────────
.table-wrap {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  overflow: hidden;
  margin-bottom: 16px;
}

.table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 12px 14px;
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: .04em;
    background: #f9fafb;
    border-bottom: 1px solid #f3f4f6;
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid #f9fafb;
    font-size: 13px;
    color: #374151;
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafafa; }
  tr.row-expanded td { background: #f0fdf4; border-bottom: none; }
}

.expand-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 2px;
  border-radius: 4px;
  vertical-align: middle;
  margin-right: 4px;
  &:hover { color: #374151; }
}

.withdrawal-num { font-weight: 600; color: #111; font-size: 12px; }
.col-order      { font-weight: 500; }
.order-link     { color: #32aa27; font-weight: 600; text-decoration: none; &:hover { text-decoration: underline; } }
.client-name    { font-weight: 500; color: #111; }
.client-email   { font-size: 11px; color: #9ca3af; }
.col-date       { font-size: 12px; color: #6b7280; white-space: nowrap; }
.col-actions    { width: 40px; }
.col-number     { white-space: nowrap; }

.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
  white-space: nowrap;
}

.type-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  &.full    { background: #eff6ff; color: #3b82f6; }
  &.partial { background: #fef3c7; color: #d97706; }
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.15s;
  &:hover { background: #f3f4f6; color: #111; }
  &:disabled { opacity: 0.4; cursor: default; }
}

.menu-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

// ── Szczegóły ─────────────────────────────────────────────────────────────────
.detail-row td {
  background: #f8fffe !important;
  border-bottom: 1px solid #e5e7eb !important;
  padding: 0 !important;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
  padding: 20px;
  gap: 20px;

  @media (max-width: 900px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
}

.detail-section {
  h4 {
    font-size: 11px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: .04em;
    margin-bottom: 8px;
  }
  p { font-size: 13px; color: #374151; margin: 4px 0; }

  &--wide { grid-column: span 3; @media (max-width: 900px) { grid-column: span 2; } @media (max-width: 560px) { grid-column: span 1; } }
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  li {
    font-size: 13px;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.item-sku { font-size: 11px; color: #9ca3af; }
.item-qty { font-size: 12px; color: #6b7280; margin-left: auto; }

// ── Paginacja ─────────────────────────────────────────────────────────────────
.pagination {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  padding: 0 8px;
  transition: all 0.15s;

  &:hover:not(:disabled) { background: #f9fafb; border-color: #32aa27; }
  &.active { background: #32aa27; color: #fff; border-color: #32aa27; font-weight: 600; }
  &:disabled { opacity: 0.4; cursor: default; }
}

.page-info { font-size: 12px; color: #9ca3af; margin-left: 8px; }

// ── Dialog odrzucenia ─────────────────────────────────────────────────────────
.reject-dialog {
  border-radius: 12px !important;
  overflow: hidden;

  &__title {
    font-size: 16px !important;
    font-weight: 700 !important;
    padding: 20px 20px 8px !important;
    display: flex;
    align-items: center;
  }

  &__subtitle {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 14px;
  }

  &__actions {
    padding: 8px 20px 20px !important;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
}

.reject-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.reject-textarea {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: #ef4444; }
  &--error { border-color: #ef4444; }
}

.reject-error {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  &:hover { background: #f9fafb; }
}

.btn-reject {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #ef4444;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #dc2626; }
}

.detail-section--rejection {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px;

  h4 { color: #ef4444 !important; }
  p  { color: #7f1d1d; }
}

.state-msg {
  padding: 60px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
  &.error { color: #ef4444; }
}

.status-menu { min-width: 180px; }
</style>
