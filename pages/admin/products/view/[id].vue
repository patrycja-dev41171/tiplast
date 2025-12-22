<template>
     <section class="inventory-page">
        <AdminPageHeader text="Dane produktowe" />
      </section>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: "admin-client",
});
</script>

<style scoped>
    .inventory-page {
    padding: 30px;
}

</style>