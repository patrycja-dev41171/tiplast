<template>
  <div class="product-description" v-html="description"></div>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.product-description {
  margin: 30px 0;
  font-size: 16px;
  line-height: 1.6;
  color: #333;

  :deep(strong) {
    font-weight: 600;
  }

  :deep(ul) {
    list-style: disc;
    margin: 10px 0 10px 20px;
  }
  :deep(h2) {
    margin: 20px 0 10px !important;
  }
  :deep(h3) {
    margin: 10px 0 10px !important;
  }
  :deep(p) {
    margin-bottom: 10px;
  }
}
</style>
