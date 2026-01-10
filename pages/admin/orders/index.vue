<script setup>
definePageMeta({
  layout: 'admin',
  middleware: "admin-client",
});

const {getOrders, deleteOrder} = useOrder()

const orders = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
  orders.value = await getOrders();
  loading.value = false;
};


onMounted(async () => {
  await fetchOrders();
});


const deleteOr = async (id) => {
  if (!confirm("Czy na pewno chcesz usunąć to zamówienie?")) return;
  if (!confirm("Czy na pewno chcesz usunąć to zamówienie? Nie ma odwrotu tej akcji.")) return;

  const { error } = await deleteOrder(id)

  if (error) {
    console.error(error);
    alert("Błąd podczas usuwania zamówienia.");
  } else {
    alert("Zamówienie zostało usunięte.");
    await fetchProducts();
  }
};

const calculateProductsTotal = (order) => {
  if (!order?.order_items?.length) return 0

  const total = order.order_items.reduce((sum, item) => {
    return sum + item.quantity * Number(item.price_snapshot)
  }, 0)

  return Number(total.toFixed(2))
}

</script>

<template>
  <div class="admin-products">
    <AdminPageHeader text="Zamówienia" />

    <NuxtLink to="/admin/order/add" class="add-btn">
      + Dodaj zamówienie
    </NuxtLink>

    <div v-if="loading">Ładowanie...</div>

    <table v-else class="products-table">
      <thead>
        <tr>
          <th>Zamówienie</th>
          <th>Data</th>
          <th>Status</th>
          <th>Towar</th>
          <th>Dostawa</th>
          <th>Razem</th>
          <th>Płatność</th>
          <th>Email klienta</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="order in orders" :key="order.id">
         <td><NuxtLink :to="`/admin/order/view/${order.order_id}`" class="link"><strong>{{ order.order_number }}</strong></NuxtLink></td>
         <td>{{ formatDate(order.created_at) }}</td>
         <td :style="{color: getOrderStatusMeta(order.status).color}">{{ getOrderStatusMeta(order.status).label }}</td>
         <td>{{ calculateProductsTotal(order).toFixed(2) }} zł</td>
         <td>{{ order.order_shipping_details.price_gross.toFixed(2) }} zł</td>
         <td>{{ order.order_shipping_details.price_gross + calculateProductsTotal(order) }} zł</td>
         <td :style="{color: getPaymentStatusMeta(order.payment_status).color}">{{ getPaymentStatusMeta(order.payment_status).label }}</td>
         <td>{{ order.email }}</td> 
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.admin-products {
  padding: 30px;
}

.admin-products h1 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}

.add-btn {
  display: inline-block;
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 600;
  transition: 0.2s background;
}

.add-btn:hover {
  background: #1e4fc7;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.products-table th {
  text-align: left;
  padding: 14px;
  background: #f7f7f7;
  font-weight: 600;
  border-bottom: 1px solid #e3e3e3;
}

.products-table td {
  padding: 14px;
  border-bottom: 1px solid #e5e5e5;
}

.products-table tr:last-child td {
  border-bottom: none;
}

.edit-link {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

.edit-link:hover {
  color: #1e4fc7;
}

.visible-flag {
  color: #059669;
  /* zielony */
  font-weight: 600;
}

.hidden-flag {
  color: #dc2626;
  /* czerwony */
  font-weight: 600;
}

/* Responsywność */
@media (max-width: 600px) {

  .products-table th,
  .products-table td {
    padding: 10px;
    font-size: 14px;
  }

  .admin-products h1 {
    font-size: 22px;
  }
}

.color {
  width: 20px;
  height: 20px;
  border: 2px solid black;
}

.product_photo {
  width: 80px;
  height: 80px;
}

.link {
    color: #1e4fc7 !important;
  &:hover {
    text-decoration: underline;
  }
}
</style>
