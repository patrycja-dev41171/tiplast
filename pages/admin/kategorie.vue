<script setup>
definePageMeta({
    layout: "admin",
    middleware: "admin-client",
});

const { getAllCategories, addNewCategory, updateCategory, deleteCategoryById } = useCategories()

const categories = ref([]);
const loading = ref(true);
const newCategory = ref({
    display_name: "",
    slug: "",
});

// Pobierz kategorie
const loadCategories = async () => {
    loading.value = true;

    const { data, error } = await getAllCategories("id");

    if (!error) categories.value = data;

    loading.value = false;
};

// Dodaj nową kategorię
const addCategory = async () => {
    if (!newCategory.value.display_name) return;

    if (!newCategory.value.slug) {
        newCategory.value.slug = newCategory.value.display_name
            .toLowerCase()
            .replaceAll(" ", "-")
            .replace(/[^\w-]+/g, "");
    }

    const { error } = await addNewCategory(newCategory.value);

    if (!error) {
        newCategory.value = { display_name: "", slug: "" };
        await loadCategories();
    }
};

// Zapisz edycję
const updateCat = async (cat) => {
    const { error } = await updateCategory(cat)

    if (error) {
        alert("Błąd przy aktualizacji kategorii")
    } else {
        alert("Zapisano zmiany!")
    };
};

const deleteCategory = async (id) => {
    if (!confirm("Na pewno chcesz usunąć?")) return;

    const { error } = await deleteCategoryById(id)

    if (error) {
        alert(error.message);
        return;
    }

    loadCategories();
};

onMounted(() => {
    loadCategories();
});
</script>

<template>
    <div class="admin-categories">
        <h1>Kategorie</h1>

        <div v-if="loading">Ładowanie...</div>

        <table v-else class="cat-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nazwa</th>
                    <th>Slug</th>
                    <th>Akcje</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="cat in categories" :key="cat.id">
                    <td>{{ cat.id }}</td>

                    <td>
                        <input v-model="cat.display_name" />
                    </td>

                    <td>
                        <input v-model="cat.slug" />
                    </td>

                    <td class="actions">
                        <button class="save-btn" @click="updateCat(cat)"><v-icon icon="mdi-content-save"
                                size="small"></v-icon> Zapisz</button>
                        <button class="delete-btn" @click="deleteCategory(cat.id)"><v-icon icon="mdi-delete"
                                size="small"></v-icon> Usuń</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="add-box">
            <h2>Dodaj nową kategorię</h2>
            <div class="fields">
                <input v-model="newCategory.display_name" placeholder="Nazwa kategorii" />
                <input v-model="newCategory.slug" placeholder="Slug (łącznie, małymi literami, bez polskich znaków)" />
                <button class="add-btn" @click="addCategory"><v-icon icon="mdi-plus" size="small"></v-icon>
                    Dodaj</button>
            </div>
        </div>
    </div>
</template>

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
    background: white;
    border-collapse: collapse;
    border-radius: 4px;
    overflow: hidden;
    table-layout: fixed;
    /* 🟢 stabilna szerokość kolumn */
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
    width: 40%;
    /* Nazwa */
}

.cat-table th:nth-child(3),
.cat-table td:nth-child(3) {
    width: 40%;
    /* Slug */
}

.cat-table th:nth-child(4),
.cat-table td:nth-child(4) {
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

    button,
    input {
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
