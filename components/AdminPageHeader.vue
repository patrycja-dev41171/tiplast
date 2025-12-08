<template>
  <h1 class="section-title">
    {{ text }}
  </h1>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

<style scoped lang="scss">
.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #111;
  letter-spacing: .5px;
  margin-bottom: 16px;
  @media (max-width: 600px) {
    font-size: 22px;
  }
}
</style>
