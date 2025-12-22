<template>
  <Table
    :columns="columns"
    :rows="sortedCartoons"
  >
    <!-- Zdjęcie -->
    <template #cell-photo="{ row }">
      <v-img
        aspect-ratio="16/9"
        cover
        :src="row.photos[0]?.url"
        class="product_photo"
      />
    </template>

    <!-- Ostatnia aktualizacja -->
    <template #cell-updated_at="{ value }">
      {{ formatDate(value) }}
    </template>

    <!-- Akcja -->
    <template #cell-action="{ row }">
      <NuxtLink :to="`/admin/pakowanie/${row.id}`" class="btn">
        Zarządzaj
      </NuxtLink>
    </template>
  </Table>
</template>

<script setup>

const props = defineProps({
  cartoons: {
    type: Array,
    required: true
  }
});

const columns = [
  { label: "Nazwa", key: "display_name" },
  { label: "SKU", key: "sku" },
  { label: "Szerokość [cm]", key: "width" },
  { label: "Długość [cm]", key: "length" },
  { label: "Wysokość [cm]", key: "height" },
  { label: "Dostępne", key: "stock" },
  { label: "Ostatnia aktualizacja", key: "updated_at" },
  { label: "Akcja", key: "action" }
];

const sortedCartoons = computed(() =>
  [...props.cartoons].sort((a, b) =>
    a.sku.localeCompare(b.sku)
  )
);

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
