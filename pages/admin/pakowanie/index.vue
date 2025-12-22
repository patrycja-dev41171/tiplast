<template>
    <section class="inventory-page">
    <AdminPageHeader text="Kartony / Pakowanie" />
    <PakowanieTable :cartoons="cartoons" />
  </section>
</template>


<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin-client'
});

const { getAllCartoons } = useCartoons();

const cartoons = ref([]);

onMounted(async () => {
  cartoons.value = await getAllCartoons()
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
