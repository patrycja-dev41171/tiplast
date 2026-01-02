<template>
  <Table :columns="columns" :rows="sortedProducts">
    <!-- Zdjęcie -->
    <template #cell-photo="{ row }">
      <v-img aspect-ratio="16/9" cover :src="row.photos[0]?.url" class="product_photo" />
    </template>

    <template #cell-kit="{ value }">
      {{ value ? 'Tak' : "Nie" }}
    </template>

     <template #cell-quantity="{ row }">
      {{ getStockQuantity(row)}}
    </template>

    <!-- Ostatnia aktualizacja -->
    <template #cell-updated_at="{ value }">
      {{ formatDate(value) }}
    </template>

    <!-- Akcja -->
    <template #cell-action="{ row }">
      <NuxtLink v-if="!row.kit" :to="`/admin/inventory/${row.id}`" class="btn">
        Zarządzaj
      </NuxtLink>
    </template>
  </Table>
</template>

<script setup>

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
});



const columns = [
  { label: "", key: "photo" },
  { label: "Nazwa", key: "display_name" },
  { label: "SKU", key: "sku" },
  { label: "Komplet", key: "kit" },
  { label: "Dostępne", key: "quantity" },
  { label: "Ostatnia aktualizacja", key: "updated_at" },
  { label: "Akcja", key: "action" }
];

const sortedProducts = computed(() =>
  [...props.products].sort((a, b) =>
    a.sku.localeCompare(b.sku)
  )
);


const getStockQuantity = (product) => {
  if (product.kit) {
    return product.kit_stock?.[0]?.quantity ?? 0
  }
  return product.product_stock?.quantity ?? 0
}

</script>

<style scoped>
.btn {
  display: inline-block;
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: 0.2s background;
}

.product_photo {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
}
</style>
