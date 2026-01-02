<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin-client",
});

const {
  getAllColors,
  createColor,
  updateColor,
  deleteColor
} = useColors();

const colors = ref([]);
const loading = ref(true);


const loadColors = async () => {
  loading.value = true;
  const { data } = await getAllColors();
  colors.value = data;
  loading.value = false;
};

const addColor = async (data) => {
  if (!data.display_name || !data.value) return;

  try {
    await createColor({
      display_name: data.display_name,
      value: data.value
    });

    await loadColors();
  } catch (err) {
    alert(err.message);
  }
};

const saveColor = async (row) => {
  try {
    await updateColor(row.id, {
      display_name: row.display_name,
      value: row.value,
    });
    alert("Zapisano zmiany!");
  } catch (err) {
    alert(err.message);
  }
};

const removeColor = async (row) => {
  try {
    await deleteColor(row.value,
    );
    alert("Usunięto kolor!");
    await loadColors()
  } catch (err) {
    alert(err.message);
  }
};


onMounted(loadColors);

const columns = [
  { label: "ID", key: "id" },
  { label: "Nazwa", key: "display_name" },
  { label: "HEX", key: "value" },
  { label: "Podgląd", key: "preview" },
  { label: "Akcje", key: "actions" },
];
</script>

<template>
  <div class="pa-7">
    <AdminPageHeader text="Kolory" />

    <div v-if="loading">Ładowanie...</div>
    <Table v-else :columns="columns" :rows="colors" idKey="id">
      <!-- Edycja nazwy -->
      <template #cell-display_name="{ row }">
        <input v-model="row.display_name" />
      </template>

      <!-- Edycja HEX -->
      <template #cell-value="{ row }">
        <input v-model="row.value" />
      </template>

      <!-- Podgląd -->
      <template #cell-preview="{ row }">
        <div class="preview" :style="{ background: row.value }"></div>
      </template>

      <!-- Akcje -->
      <template #cell-actions="{ row }">
        <button class="save-btn" @click="saveColor(row)">
          <v-icon icon="mdi-content-save" size="small" /> Zapisz
        </button>

        <button class="delete-btn" @click="removeColor(row)">
          <v-icon icon="mdi-delete" size="small" /> Usuń
        </button>
      </template>
    </Table>

    <AddNewColor @add="addColor" />

  </div>
</template>

<style scoped lang="scss">
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


.preview {
  width: 96px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: auto;
}

.save-btn {
  background: #2563eb;
  color: white;
  padding: 8px 14px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

.delete-btn {
  background: #ffecec;
  color: #c0392b;
  padding: 8px 14px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
</style>
