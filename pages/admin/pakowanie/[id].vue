<template>
  <section class="product-admin-page">
    <h2>{{ cartoon?.display_name }}</h2>

    <h4 class="mt-3">Aktualny stan: {{ cartoon?.stock }} sztuk</h4>
    <h4 class="mt-3">Ostatnia Aktualizacja:{{ formatDate(cartoon?.updated_at)  }}</h4>

    <InventoryActions
    v-if="cartoon"
      :product-id="cartoon.id"
      :current-stock="cartoon?.stock"
      @updated="reload"
    />

    <h2>Historia zmian</h2>

<table class="history-table">
  <thead>
    <tr>
      <th>Typ zmiany</th>
      <th>Zmiana</th>
      <th>Użytkownik</th>
      <th>Data</th>
      <th>Notatka</th>
    </tr>
  </thead>

  <tbody>
    <tr v-for="log in logs" :key="log.id">
      <td><span class="tag" :class="log.change_type">{{ mapReason(log.change_type) }}</span></td>
      <td>{{ log.quantity_before }} → {{ log.quantity_after }} ({{ log.difference > 0 ? '+' : '' }}{{ log.difference }})</td>
      <td>{{ log.profiles?.email || '—' }}</td>
      <td>{{ formatDate(log.created_at) }}</td>
      <td>{{ log.note || '-' }}</td>
    </tr>
  </tbody>
</table>
  </section>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin-client'
});

import InventoryActions from "~/components/InventoryActions.vue"
import { useProducts } from "~/composables/useProducts"
import { useInventory } from "~/composables/useInventory"
import { useRoute } from "vue-router"
import { ref, onMounted } from "vue"

import stockUpdateResons from "~/vars/stockUpdateResons"

const mapReason = (value) => {
  const found = stockUpdateResons.find(r => r.value === value)
  return found ? found.label : value
}

const route = useRoute()

// composables
const { getCartoonById } = useCartoons()

// reactive data
const cartoon = ref(null)

const loadData = async () => {
  cartoon.value = await getCartoonById(route.params.id)
}

onMounted(loadData)

const reload = () => loadData()
</script>

<style scoped>
.product-admin-page {
  padding: 30px;
}
.logs {
  list-style: none;
  padding: 0;
}
.logs li {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.history-table th {
  background: #f7f7f7;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

.history-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.tag {
  padding: 4px 8px;
  font-size: 13px;
  border-radius: 6px;
  color: white;
  text-transform: capitalize;
}
.tag.manual_update { background: #7d7d7d; }
.tag.restock { background: #22c55e; }
.tag.inventory_adjustment { background: #eab308; }
.tag.damage_loss { background: #ef4444; }
.tag.order_online,
.tag.order_store { background: #2563eb; }
.tag.return_customer { background: #f97316; }

</style>
