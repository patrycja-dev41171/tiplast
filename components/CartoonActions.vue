<template>
  <div class="actions">
    <h3>Zmiana stanu magazynowego</h3>

    <label>Nowa ilość</label>
    <input type="number" v-model.number="qty" />

    <label>Powód zmiany</label>
    <select v-model="changeType">
      <option v-for="reason in stockUpdateResons" :key="reason.value" :value="reason.value" :disabled="reason.disabled">
        {{ reason.label }}
      </option>
    </select>

    <label>Notatka (opcjonalnie)</label>
    <input type="text" v-model="note" placeholder="np. dostawa z hurtowni" />

     <p v-if="error" class="error">{{ error }}</p>

    <button @click="submit" :disabled="loading">
      {{ loading ? "Zapisywanie..." : "Zapisz zmiany" }}
    </button>

    <p v-if="saved">✔ Zmieniono stan magazynu</p>
  </div>
</template>

<script setup>
import stockUpdateResons from "~/vars/stockUpdateResons"
import { ref } from "vue"

const props = defineProps({
  cartoonId: String,
  currentStock: Number
})

const emit = defineEmits(["updated"])
const { updateCartoonStock, createCartoonStockLog } = useCartoonsStock()

const qty = ref(props.currentStock)
const changeType = ref("manual_update")
const note = ref("")
const loading = ref(false)
const saved = ref(false)
const error = ref("")

const submit = async () => {
   error.value = ""
  saved.value = false

  if (qty.value === null || qty.value === undefined || qty.value === "") {
    error.value = "Podaj nową ilość!"
    return
  }

  if (!changeType.value) {
    error.value = "Wybierz powód zmiany!"
    return
  }

  loading.value = true
  saved.value = false

  const result = await updateCartoonStock(props.cartoonId, qty.value)

  await createCartoonStockLog({
    recordId: props.cartoonId,
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
button {
  padding: 10px 14px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  filter: brightness(90%);
  cursor: pointer;
 
}
input, select {
  padding: 8px;
  border: 1px solid #ccc;
}

.error {
  color: #dc2626;
  font-weight: 600;
}
</style>
