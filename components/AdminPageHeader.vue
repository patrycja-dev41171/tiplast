<template>
  <div>
    <NuxtLink href="#" @click.prevent="goBack"  class="back"><v-icon icon="mdi-arrow-left-thin" color="black" class="mr-1" />Powrót
    </NuxtLink>
    <h1 class="section-title">
      {{ text }}
    </h1>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
});

const router = useRouter()

const goBack = () => {
  router.back()
}
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

.back {
  display: block;
  margin-bottom: 10px;
  width: 100px;
}
</style>
