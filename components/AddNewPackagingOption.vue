<template>
  <div class="add-box">
    <h3 class="mb-3">Dodaj nową regułę pakowania:</h3>

    <div class="fields">
      <select v-model="form.cartoon_id">
        <option disabled value="">Wybierz karton</option>
        <option
          v-for="cartoon in cartoons"
          :key="cartoon.id"
          :value="cartoon.id"
        >
          {{ cartoon.sku }}
          ({{ cartoon.length }}×{{ cartoon.width }}×{{ cartoon.height }} cm)
        </option>
      </select>

      <input
        type="number"
        min="1"
        v-model.number="form.quantity_per_cartoon"
        placeholder="Max ilość [szt.]"
      />

      <input
        type="number"
        min="0"
        step="0.01"
        v-model.number="form.max_weight"
        placeholder="Max waga [kg]"
      />

      <button class="add-btn" @click="submit">
        <v-icon icon="mdi-plus" size="small" /> Dodaj
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['add'])

defineProps({
  cartoons: {
    type: Array,
    required: true
  }
})

const form = reactive({
  cartoon_id: '',
  quantity_per_cartoon: 1,
  max_weight: null
})

const submit = () => {
  if (!form.cartoon_id || form.quantity_per_cartoon <= 0) return

  emit('add', { ...form })

  // reset
  form.cartoon_id = ''
  form.quantity_per_cartoon = 1
  form.max_weight = null
}
</script>

<style scoped lang="scss">
.add-box {
  background: #f3f4f6;
  padding: 20px;
  border-radius: 4px;
  margin-top: 40px;
  border: 1px solid #eee;
}

.fields {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  flex-wrap: wrap;

  input,
  select,
  button {
    height: 44px;
  }
}

.add-btn {
  background: #2563eb;
  color: white;
  border-radius: 4px;
  padding: 0 14px;
  border: none;
  cursor: pointer;
}

input,
select {
  width: 260px;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #fff;
  font-size: 15px;
  color: #111;

  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
    outline: none;
  }
}
</style>
