<template>
  <div class="mobile-cards">
    <NuxtLink
      v-for="order in orders"
      :key="order.order_id"
      :to="`/admin/order/view/${order.order_id}`"
      class="mobile-card"
    >
      <div class="mc-top">
        <span class="mc-number">{{ order.order_number }}</span>
        <div class="mc-badges">
          <span class="badge" :style="badgeStyle(getOrderStatusMeta(order.status).color)">
            {{ getOrderStatusMeta(order.status).label }}
          </span>
          <span class="badge" :style="badgeStyle(getPaymentStatusMeta(order.payment_status).color)">
            {{ getPaymentStatusMeta(order.payment_status).label }}
          </span>
        </div>
      </div>
      <div class="mc-client">{{ getClientName(order) }}</div>
      <div class="mc-bottom">
        <span class="mc-date">{{ formatDate(order.created_at) }}</span>
        <span class="mc-value">{{ fmtMoney(orderTotal(order)) }}</span>
      </div>
      <v-icon icon="mdi-chevron-right" size="20" class="mc-arrow" />
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({ orders: { type: Array, default: () => [] } });

const { orderTotal, getClientName, fmtMoney, badgeStyle } = useOrderHelpers();
</script>

<style scoped lang="scss">
.mobile-cards {
  display: none;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;

  @media (max-width: 768px) { display: flex; }
}

.mobile-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px 40px 14px 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  text-decoration: none;
  color: inherit;
  position: relative;
  display: block;
}

.mc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.mc-number  { font-weight: 700; font-size: 14px; color: #111; }
.mc-badges  { display: flex; gap: 5px; flex-wrap: wrap; }
.mc-client  { font-size: 13px; color: #374151; margin-bottom: 6px; }
.mc-bottom  { display: flex; justify-content: space-between; align-items: center; }
.mc-date    { font-size: 11px; color: #9ca3af; }
.mc-value   { font-weight: 700; font-size: 14px; color: #111; }

.mc-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #d1d5db;
}

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
</style>
