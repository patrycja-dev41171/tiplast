<template>
  <table class="inventory-table">
    <thead>
      <tr>
        <th></th>
        <th>Nazwa</th>
        <th>SKU</th>
        <th>Dostępne</th>
        <th>Ostatnia aktualizacja</th>
        <th>Akcja</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="p in products.sort((a, b) => a.sku.localeCompare(b.sku))" :key="p.id">
        <v-img aspect-ratio="16/9" cover :src="p.photos[0].url" class="product_photo"></v-img>
        <td>{{ p.display_name }}</td>
        <td>{{ p.sku || "-" }}</td>
        <td>{{ p.quantity }}</td>
        <td>{{ formatDate(p.updated_at) }}</td>
        <td>
          <NuxtLink :to="`/admin/inventory/${p.id}`" class="btn">
            Zarządzaj
          </NuxtLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  products: Array
})
</script>

<style scoped>
.inventory-table {
 width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.inventory-table th {
  text-align: left;
  padding: 14px;
  background: #f7f7f7;
  font-weight: 600;
  border-bottom: 1px solid #e3e3e3;
}

.inventory-table td {
  padding: 14px;
  border-bottom: 1px solid #e5e5e5;
}

.inventory-table tr:last-child td {
  border-bottom: none;
}


.products-table tr:last-child td {
  border-bottom: none;
}

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

.btn {
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

.product_photo {
  width: 80px;
  height: 80px;
}
</style>
