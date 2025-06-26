<template>
  <NuxtLink :href="obj.url">
    <div class="category-card">
      <div class="category-photo">
        <v-img
          aspect-ratio="16/9"
          cover
          :src="obj.photos[0].url"
          class="img"
        ></v-img>
      </div>
      <div class="category-description">
        <p class="category-name">{{ obj.display_name }}</p>
        <p class="category-desc">{{ obj.description }}</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  obj: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.category-card {
  width: 320px;
  height: 370px;
  background-color: white;
  padding: 20px;
  margin: 0 20px 20px 0;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  transition: 0.3s;
  transition: box-shadow 0.3s ease;
  &:hover {
    cursor: pointer;
    transform: scale(1.001);
    box-shadow: rgba(50, 50, 93, 0.3) 0px 12px 20px -3px,
      rgba(0, 0, 0, 0.35) 0px 6px 14px -4px;
  }
}

.category-photo {
  background-color: white;
  height: 205px;
}
.category-description {
  padding: 20px 0;
}
.category-name {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 17px;
  margin-bottom: 8px;
}

.category-desc {
  font-size: 15px;
  color: rgb(93, 92, 92);
}
</style>
