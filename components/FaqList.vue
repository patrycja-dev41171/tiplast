<template>
  <section class="faq-container">
    <v-expansion-panels multiple>
      <v-expansion-panel
        v-for="(item, index) in items"
        :key="index"
        min-height="74px"
      >
        <v-expansion-panel-title class="question"  collapse-icon="mdi-minus" expand-icon="mdi-plus">
          {{ item.question }}
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <p class="my-3" v-html="item.answer"></p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
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
}

.faq-container h2 {
  font-size: 24px;
  font-weight: 700;
}

.question {
  font-weight: 600;
  font-size: 17px;
}
</style>
