<template>
  <div class="table-wrap">
    <table class="orders-table">
      <thead>
        <tr>
          <th>Nr zamówienia</th>
          <th>Klient</th>
          <th>Data</th>
          <th>Status</th>
          <th>Płatność</th>
          <th>Wartość</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.order_id">
          <td class="col-number">
            <NuxtLink :to="`/admin/order/view/${order.order_id}`" class="order-link">
              {{ order.order_number }}
            </NuxtLink>
          </td>
          <td class="col-client">
            <div class="client-row">
              <div class="avatar" :style="{ background: avatarColor(order.email || '') }">
                {{ getInitials(order) }}
              </div>
              <div>
                <div class="client-name">{{ getClientName(order) }}</div>
                <div class="client-email">{{ order.email }}</div>
              </div>
            </div>
          </td>
          <td class="col-date">{{ formatDate(order.created_at) }}</td>
          <td>
            <span class="badge" :style="badgeStyle(getOrderStatusMeta(order.status).color)">
              {{ getOrderStatusMeta(order.status).label }}
            </span>
          </td>
          <td>
            <span class="badge" :style="badgeStyle(getPaymentStatusMeta(order.payment_status).color)">
              {{ getPaymentStatusMeta(order.payment_status).label }}
            </span>
          </td>
          <td class="col-value">{{ fmtMoney(orderTotal(order)) }}</td>
          <td class="col-actions">
            <NuxtLink :to="`/admin/order/view/${order.order_id}`" class="action-btn">
              <v-icon icon="mdi-eye-outline" size="18" />
            </NuxtLink>
            <NuxtLink :to="`/admin/order/view/${order.order_id}`" class="action-btn">
              <v-icon icon="mdi-pencil-outline" size="18" />
            </NuxtLink>
            <button class="action-btn action-btn--danger" @click="confirmDelete(order)">
              <v-icon icon="mdi-trash-can-outline" size="18" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Dialog potwierdzenia usunięcia -->
  <v-dialog v-model="dialog" max-width="420" persistent>
    <v-card class="confirm-dialog">
      <v-card-title class="confirm-title">
        <v-icon icon="mdi-alert-circle-outline" color="#ef4444" size="22" />
        Usuń zamówienie
      </v-card-title>
      <v-card-text class="confirm-text">
        Czy na pewno chcesz usunąć zamówienie
        <strong>{{ pendingOrder?.order_number }}</strong>?
        Tej operacji nie można cofnąć.
      </v-card-text>
      <v-card-actions class="confirm-actions">
        <button class="btn-cancel" @click="dialog = false">Anuluj</button>
        <button class="btn-delete" :disabled="deleting" @click="doDelete">
          <v-icon v-if="deleting" icon="mdi-loading" size="16" class="spin" />
          {{ deleting ? 'Usuwanie...' : 'Usuń zamówienie' }}
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const emit = defineEmits(['delete']);
defineProps({ orders: { type: Array, default: () => [] } });

const { orderTotal, getInitials, getClientName, avatarColor, fmtMoney, badgeStyle } = useOrderHelpers();

const dialog      = ref(false);
const pendingOrder = ref(null);
const deleting    = ref(false);

const confirmDelete = (order) => {
  pendingOrder.value = order;
  dialog.value = true;
};

const doDelete = async () => {
  if (!pendingOrder.value) return;
  deleting.value = true;
  try {
    emit('delete', pendingOrder.value.order_id);
    dialog.value = false;
  } finally {
    deleting.value = false;
    pendingOrder.value = null;
  }
};
</script>

<style scoped lang="scss">
.table-wrap {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  overflow: hidden;
  margin-bottom: 16px;

  @media (max-width: 768px) { display: none; }
}

.orders-table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 13px 16px;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: .04em;
    background: #f9fafb;
    border-bottom: 1px solid #f3f4f6;
  }

  td {
    padding: 13px 16px;
    border-bottom: 1px solid #f9fafb;
    font-size: 13px;
    color: #374151;
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td      { background: #fafafa; }
}

.order-link {
  font-weight: 600;
  color: #111;
  text-decoration: none;
  &:hover { color: #32ab27; }
}

.client-row { display: flex; align-items: center; gap: 10px; }

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.client-name  { font-weight: 500; font-size: 13px; color: #111; }
.client-email { font-size: 11px; color: #9ca3af; }
.col-date     { font-size: 12px; color: #6b7280; }
.col-value    { font-weight: 600; }

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

.col-actions { display: flex; gap: 4px; }

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  color: #6b7280;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover { background: #f3f4f6; color: #111; }

  &--danger:hover { background: #fee2e2; color: #ef4444; }
}

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

.confirm-dialog { padding: 8px; }

.confirm-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #111;
  padding-bottom: 8px;
}

.confirm-text {
  font-size: 14px;
  color: #374151;
  padding-bottom: 16px;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #f9fafb; }
}

.btn-delete {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #ef4444;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #dc2626; }
  &:disabled { opacity: 0.6; cursor: default; }
}
</style>
