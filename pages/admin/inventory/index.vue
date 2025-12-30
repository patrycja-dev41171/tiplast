<template>
    <section class="inventory-page">
      <AdminPageHeader text="Zarządzanie magazynem" />
    <InventoryTable :products="productsWithStock" />
  </section>
</template>


<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin-client'
});

const { getAllProducts } = useProducts();
const { getAllStock } = useInventory();

const productsWithStock = ref([])

onMounted(async () => {
  const {data, error} = await getAllProducts()
  const stock = await getAllStock()

  productsWithStock.value = data.map((p) => {
    const s = stock.find((i) => i.record_id === p.id)
    return {
      ...p,
      quantity: s?.quantity ?? 0,
      updated_at: s?.updated_at
    }
  })
})
</script>


<style scoped>
    .inventory-page {
    padding: 30px;
}

    .inventory-page h1 {
     font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}

    h1 {
        font-size: 28px;
    margin-bottom: 20px;
}
</style>
