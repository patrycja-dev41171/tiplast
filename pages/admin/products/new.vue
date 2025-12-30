<script setup>
import draggable from "vuedraggable";

definePageMeta({
  layout: 'admin',
  middleware: "admin-client",
});

const { getAllCategories } = useCategories();
const { getAllColors } = useColors()
const { addProduct } = useProducts()
const { uploadFiles, removeFile } = useStorageProducts()


const router = useRouter();

const saving = ref(false);
const colors = ref([]);


// 1. PUSTY PRODUKT STARTOWY
const product = ref({
  sku: "",
  display_name: "",
  url: "",
  categories: [],
  color: "#000000",
  description: "",
  delivery_description: "",
  hidden: false,

  prices: {
    pln: {
      base_price: "",
      currency: "pln",
      symbol: "zł",
    },
  },

  technical_details: [{ name: "", value: "" }],
  photos: [],
});

const categories = ref([]);

const loadCategories = async () => {
  const { data, error } = await getAllCategories("id")
  if (!error) categories.value = data;
};

const loadColors = async () => {
  const { data, error } = await getAllColors();
  if (!error) {
    colors.value = data;
  }
};


const uploadPhotos = async (event) => {
  const files = event.target.files
  if (!files.length) return

  if (!product.value.sku) {
    alert("Najpierw wpisz SKU – zdjęcia muszą mieć folder!")
    return
  }

  const uploaded = await uploadFiles({
    folder: product.value.sku,
    files,
  })

  uploaded.forEach(file => {
    product.value.photos.push({
      url: file.publicUrl,
      alt: product.value.display_name,
    })
  })

  event.target.value = ""
}

const removePhoto = async (i) => {
  const photo = product.value.photos[i]
  if (!photo?.url) return

  const path = photo.url.split("/products/")[1]

  await removeFile(path)
  product.value.photos.splice(i, 1)
}

// 🔹 4. Zapis nowego produktu (INSERT)
const saveProduct = async () => {
  saving.value = true;

  // automatyczny URL
  if (!product.value.url) {
    product.value.url = product.value.display_name
      .toLowerCase()
      .replaceAll(" ", "-")
      .replace(/[^\w-]+/g, "");
  }

  const payload = {
    ...product.value,
    categories:
      typeof product.value.categories === "string"
        ? product.value.categories.split(",").map((c) => c.trim())
        : product.value.categories,
  };

  const { error } = await addProduct();

  saving.value = false;

  if (error) {
    console.error(error);
    alert("Błąd podczas zapisu ❌");
  } else {
    alert("Produkt dodany 🎉");
    router.push("/admin/products");
  }
};

onMounted(async () => {
  await loadCategories();
  await loadColors();
});
</script>

<template>
  <div class="admin-edit">
    <NuxtLink to="/admin/products" class="back-link">← Powrót</NuxtLink>

    <h1>Dodaj nowy produkt</h1>

    <div class="form">
      <!-- 🎯 SEKCJA 1 -->
      <section>
        <h2>Podstawowe informacje</h2>

        <label>SKU</label>
        <input v-model="product.sku" />

        <label>Nazwa</label>
        <input v-model="product.display_name" />

        <label>URL</label>
        <input v-model="product.url" />

        <label>Kategorie produktu</label>
        <div class="categories-list">
          <label v-for="cat in categories" :key="cat.id" class="cat-item">
            <input type="checkbox" :value="cat.id" v-model="product.categories" />
            {{ cat.display_name }}
          </label>
        </div>

        <label>Kolor</label>

        <div class="color-select-wrapper">
          <select v-model="product.color" class="color-select">
            <option disabled value="">Wybierz kolor</option>

            <option v-for="col in colors" :key="col.id" :value="col.value" :style="{ '--color': col.value }">
              {{ col.display_name }}
            </option>
          </select>

          <div class="color-preview" v-if="product.color" :style="{ background: product.color }"></div>
        </div>


        <label>Opis (HTML)</label>
        <textarea v-model="product.description"></textarea>

        <label>Opis dostawy (HTML)</label>
        <textarea v-model="product.delivery_description"></textarea>

        <label>Ukryty produkt?</label>
        <input type="checkbox" v-model="product.hidden" />
      </section>

      <!-- 🎯 SEKCJA 2 -->
      <section>
        <h2>Ceny</h2>

        <label>Cena PLN</label>
        <input v-model="product.prices.pln.base_price" />
      </section>

      <!-- 🎯 SEKCJA 3 -->
      <section>
        <h2>Parametry techniczne</h2>

        <div v-for="(row, idx) in product.technical_details" :key="idx" class="row">
          <input v-model="row.name" placeholder="Nazwa" />
          <input v-model="row.value" placeholder="Wartość" />
          <button @click="product.technical_details.splice(idx, 1)">🗑</button>
        </div>

        <button class="small-btn" @click="product.technical_details.push({ name: '', value: '' })">
          ➕ Dodaj parametr
        </button>
      </section>

      <!-- 🎯 SEKCJA 4 -->
      <section>
        <h2>Zdjęcia</h2>

        <draggable v-model="product.photos" item-key="url" class="photos-grid" ghost-class="drag-ghost" animation="200">
          <template #item="{ element, index }">
            <div class="photo-box">
              <img :src="element.url" class="photo-img" />
              <button class="delete-btn" @click="removePhoto(index)">
                Usuń
              </button>
            </div>
          </template>
        </draggable>

        <input type="file" multiple @change="uploadPhotos" />
      </section>

      <!-- 🎯 SEKCJA 5 -->
      <section>
        <button class="save-btn" @click="saveProduct" :disabled="saving">
          💾 Zapisz produkt
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-edit {
  padding: 30px;
  max-width: 800px;
  margin: auto;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #2563eb;
}

h1 {
  font-size: 28px;
  margin-bottom: 25px;
}

section {
  margin-bottom: 40px;
  padding-bottom: 25px;
  border-bottom: 1px solid #e5e5e5;
}

h2 {
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: 600;
}

label {
  display: block;
  margin-top: 12px;
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  margin-top: 6px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

textarea {
  min-height: 120px;
}

.row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.row input {
  flex: 1;
}

.small-btn {
  margin-top: 5px;
  background: #e5e7eb;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}

.photos-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.photo-box {
  width: 140px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  background: white;
}

.photo-img {
  width: 100%;
  border-radius: 8px;
}

.delete-btn {
  margin-top: 8px;
  background: #ffecec;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  color: #c0392b;
}

.save-btn {
  background: #2563eb;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.drag-ghost {
  opacity: 0.4;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 6px;
}

.color-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-select {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #ccc;
  appearance: none;
  cursor: pointer;
  font-size: 15px;
  text-transform: capitalize;
}

/* Każda opcja ma kolorowe kółeczko */
.color-select option {
  padding-left: 26px;
  background-image: radial-gradient(circle, var(--color) 50%, transparent 51%);
  background-repeat: no-repeat;
  background-position: 6px center;
  background-size: 12px 12px;
}

/* Kółko z aktualnym kolorem obok selecta */
.color-preview {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #ccc;
}
</style>
