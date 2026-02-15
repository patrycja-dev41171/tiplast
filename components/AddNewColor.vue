<template>
  <div class="add-box">
    <h3 class="mb-3">Dodaj nowy kolor:</h3>

    <div class="fields">
      <input
        v-model="form.display_name"
        placeholder="Nazwa (np. grafitowy)"
      />
      <input
        v-model="form.value"
        placeholder="#hex"
      />

      <button class="add-btn" @click="submit">
        <v-icon icon="mdi-plus" size="small" /> Dodaj
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["add"]);

const form = reactive({
  display_name: "",
  value: "",
});

const submit = () => {
  if (!form.display_name || !form.value) return;
  emit("add", { ...form });

  form.display_name = "";
  form.value = "";
};
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

  input,
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

input {
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

td input {
  background: #f8fafc; // jaśniejsze tło w tabeli
}
</style>
