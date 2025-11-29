<template>
  <section class="faq-container">
    <h2 v-if="title" class="mb-3">{{ title }}</h2>
    <FaqItem
      v-for="(item, index) in items"
      :key="index"
      :question="item.question"
      :answer="item.answer"
    />
  </section>
</template>

<script setup>

defineProps({
  title: {
    type: String,
    default: "Najczęściej zadawane pytania"
  },
  items: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.faq-container {
  max-width: 800px;
  margin: 40px 0;
}

.faq-container h2 {
  font-size: 24px;
  font-weight: 700;
}
</style>
