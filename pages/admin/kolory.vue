<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin-client",
});

const { $supabase } = useNuxtApp();

const colors = ref([]);
const loading = ref(true);

const newColor = ref({
  display_name: "",
  value: "",
});

// Pobieranie kolorów
const loadColors = async () => {
  loading.value = true;

  const { data, error } = await $supabase
    .from("colors")
    .select("*")
    .order("id");

  if (!error) colors.value = data;

  loading.value = false;
};

// Dodawanie koloru
const addColor = async () => {
  if (!newColor.value.display_name || !newColor.value.value) return;

  const { error } = await $supabase.from("colors").insert(newColor.value);

  if (!error) {
    newColor.value = { display_name: "", value: "" };
    await loadColors();
  }
};

// Update koloru
const updateColor = async (color) => {
  const { error } = await $supabase
    .from("colors")
    .update({
      display_name: color.display_name,
      value: color.value,
    })
    .eq("id", color.id);

  if (error) {
    alert("Błąd podczas aktualizacji koloru");
  } else {
    alert("Zapisano zmiany!");
  }
};

// Usuwanie koloru (z blokadą gdy powiązany z produktem)
const deleteColor = async (colorValue) => {
  if (!confirm("Na pewno chcesz usunąć kolor?")) return;

  // Czy kolor jest używany w produktach?
  const { count } = await $supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("color", colorValue);

  if (count > 0) {
    alert(`Nie można usunąć — kolor jest używany w ${count} produktach.`);
    return;
  }

  const { error } = await $supabase
    .from("colors")
    .delete()
    .eq("value", colorValue);

  if (error) {
    alert(error.message);
    return;
  }

  await loadColors();
};

onMounted(() => {
  loadColors();
});
</script>

<template>
  <div class="admin-categories">
    <h1>Kolory</h1>

    <div v-if="loading">Ładowanie...</div>

    <table v-else class="cat-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nazwa</th>
          <th>HEX</th>
          <th>Podgląd</th>
          <th>Akcje</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="col in colors" :key="col.id">
          <td>{{ col.id }}</td>

          <td><input v-model="col.display_name" /></td>

          <td><input v-model="col.value" /></td>

          <td>
            <div class="preview" :style="{ background: col.value }"></div>
          </td>

          <td class="actions">
            <button class="save-btn" @click="updateColor(col)">
              <v-icon icon="mdi-content-save" size="small" /> Zapisz
            </button>

            <button class="delete-btn" @click="deleteColor(col.value)">
              <v-icon icon="mdi-delete" size="small" /> Usuń
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Dodawanie -->
    <div class="add-box">
      <h2>Dodaj nowy kolor</h2>

      <div class="fields">
        <input v-model="newColor.display_name" placeholder="Nazwa (np. grafitowy)" />
        <input v-model="newColor.value" placeholder="#hex" />

        <button class="add-btn" @click="addColor">
          <v-icon icon="mdi-plus" size="small" /> Dodaj
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.preview {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: auto;
}
</style>

<style scoped lang="scss">
h1 {
    font-size: 26px;
    margin-bottom: 20px;
}

.add-box {
    background: #f3f4f6;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 25px;
    border: 1px solid #eee;
    margin-top: 50px;
}

.add-box input {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: #fff;
}

.add-btn {
    width: 200px;
    margin-top: 15px;
    background: #2563eb;
    color: white;
    padding: 10px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
}

.cat-table {
    width: 100%;
    max-width: 100%;
    background: white;
    border-collapse: collapse;
    border-radius: 4px;
    overflow: hidden;
    table-layout: fixed;
}

.cat-table th,
.cat-table td {
    padding: 12px 10px;
    text-align: left;
}

.cat-table tr {
    border-bottom: 1px solid #eee;
}

.cat-table th:nth-child(1),
.cat-table td:nth-child(1) {
    width: 30px;
    /* ID */
    font-weight: 600;
}

.cat-table th:nth-child(2),
.cat-table td:nth-child(2) {
    width: 35%;
    /* Nazwa */
}

.cat-table th:nth-child(3),
.cat-table td:nth-child(3) {
    width: 35%;
    /* Slug */
}

.cat-table th:nth-child(4),
.cat-table td:nth-child(4) {
    width: 80px;
    text-align: center;
}

.cat-table th:nth-child(5),
.cat-table td:nth-child(5) {
    width: 180px;
    /* Akcje */
}

.cat-table input {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 15px;
    background: #fff;
}

/* Akcje */
.actions {
    display: flex;
    gap: 12px;

    button {
        height: 44px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
}

.save-btn {
    background: #2563eb;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
}

.save-btn:hover {
    background: #1d4ed8;
}

.delete-btn {
    background: #ffecec;
    border: none;
    padding: 8px 14px;
    border-radius: 4px;
    cursor: pointer;
    color: #c0392b;
    white-space: nowrap;
}

.delete-btn:hover {
    background: #ffd6d6;
}

.fields {
    display: flex;
    gap: 12px;
    margin: 10px auto;
     button, input {
        height: 44px;
        margin-top: 0;
    }
    button {
        display: flex;
        align-items: center;
        gap: 8px;
    }
}
</style>
