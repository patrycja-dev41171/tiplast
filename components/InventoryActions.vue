<template>
  <div class="actions">
    <h3>Zmiana stanu magazynowego</h3>

    <!-- TRYB ZMIANY -->
    <label>Rodzaj zmiany</label>
    <div class="modes">

      <label>
        <input type="radio" value="add" v-model="mode" />
        Dodaj
      </label>

      <label>
        <input type="radio" value="subtract" v-model="mode" />
        Odejmij
      </label>

       <label>
        <input type="radio" value="set" v-model="mode" />
        Ustaw nową ilość
      </label>
    </div>

    <!-- WARTOŚĆ -->
    <label>
      {{ mode === "set" ? "Nowa ilość" : "Ilość" }}
    </label>
    <input
      type="number"
      min="0"
      v-model.number="value"
    />

    <!-- PODGLĄD -->
    <p class="preview">
      Aktualny stan: <strong>{{ currentStock }}</strong><br />
      Nowy stan: <strong>{{ finalQty }}</strong>
    </p>

    <!-- POWÓD -->
    <label>Powód zmiany</label>
    <select v-model="changeType">
      <option
        v-for="reason in stockUpdateResons"
        :key="reason.value"
        :value="reason.value"
        :disabled="reason.disabled"
      >
        {{ reason.label }}
      </option>
    </select>

    <!-- NOTATKA -->
    <label>Notatka (opcjonalnie)</label>
    <input
      type="text"
      v-model="note"
      placeholder="np. dostawa z hurtowni"
    />

    <p v-if="error" class="error">{{ error }}</p>

    <button @click="submit" :disabled="loading">
      {{ loading ? "Zapisywanie..." : "Zapisz zmiany" }}
    </button>

    <p v-if="saved" class="success">✔ Zmieniono stan magazynu</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import stockUpdateResons from "~/vars/stockUpdateResons"
import { useInventory } from "~/composables/useInventory"

const props = defineProps({
  productId: {
    type: String,
    required: true
  },
  currentStock: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(["updated"])
const { updateStock, createStockLog } = useInventory()

// state
const mode = ref("set") // set | add | subtract
const value = ref(0)
const changeType = ref("manual_update")
const note = ref("")
const loading = ref(false)
const saved = ref(false)
const error = ref("")

// obliczenie nowego stanu
const finalQty = computed(() => {
  if (mode.value === "set") {
    return value.value
  }

  if (mode.value === "add") {
    return props.currentStock + value.value
  }

  if (mode.value === "subtract") {
    return Math.max(0, props.currentStock - value.value)
  }

  return props.currentStock
})

// submit
const submit = async () => {
  error.value = ""
  saved.value = false

  if (value.value === null || value.value === undefined) {
    error.value = "Podaj ilość!"
    return
  }

  if (finalQty.value < 0) {
    error.value = "Stan nie może być ujemny!"
    return
  }

  loading.value = true

  const result = await updateStock(props.productId, finalQty.value)

  await createStockLog({
    productId: props.productId,
    before: result.before,
    after: result.after,
    changeType: changeType.value,
    note: note.value
  })

  loading.value = false
  saved.value = true
  emit("updated")
}
</script>

<style scoped>
.actions {
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modes {
  display: flex;
  gap: 20px;
}

input,
select {
  padding: 8px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 14px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
}

.preview {
  background: #f8fafc;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
}

.error {
  color: #dc2626;
  font-weight: 600;
}

.success {
  color: #16a34a;
  font-weight: 600;
}
</style>
