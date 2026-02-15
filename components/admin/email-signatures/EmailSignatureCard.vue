<template>
  <v-card>
    <v-card-title class="text-subtitle-1 font-weight-bold">
      {{ signature.name }}
    </v-card-title>

    <v-divider />

    <v-card-text>
      <div class="preview" v-html="signature.html" />
    </v-card-text>

    <v-divider />

    <v-card-text>
      <v-textarea
        label="Kod HTML"
        :model-value="signature.html"
        rows="8"
        readonly
        auto-grow
        class="monospace"
      />
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" @click="copy">
        Kopiuj HTML
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps({
  signature: {
    type: Object,
    required: true
  }
})

const copy = async () => {
  await navigator.clipboard.writeText(props.signature.html)
  alert('Podpis skopiowany do schowka')
}
</script>

<style scoped>
.preview {
  border: 1px solid #e5e7eb;
  background: #fafafa;
  width: 652px;
}

.monospace textarea {
  font-family: monospace !important;
  font-size: 12px;
}
</style>
