<template>
    <section class="inventory-page">
    <AdminPageHeader text="Kartony / Pakowanie" />
    <PakowanieTable :cartoons="cartoonsWithStock" />
  </section>
</template>


<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin-client'
});

const { getAllCartoons } = useCartoons();
const { getAllCartoonsStock } = useCartoonsStock();

const cartoonsWithStock = ref([]);

onMounted(async () => {
  const cartoons = await getAllCartoons()
  const stock = await getAllCartoonsStock()

  cartoonsWithStock.value = cartoons.map((p) => {
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
