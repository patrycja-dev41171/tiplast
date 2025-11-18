<script setup>
definePageMeta({
  middleware: "admin-client",
});

import draggable from "vuedraggable";

const route = useRoute();
const { $supabase } = useNuxtApp();

const product = ref(null);
const saving = ref(false);

// 🚀 1. Pobranie produktu
const loadProduct = async () => {
  const { data, error } = await $supabase
    .from("products")
    .select("*")
    .eq("id", route.params.id)
    .single();

  product.value = data;
};

onMounted(loadProduct);

// 🚀 2. Zapis do Supabase
const saveProduct = async () => {
  saving.value = true;

  const { error } = await $supabase
    .from("products")
    .update({
      photos: product.value.photos,
    })
    .eq("id", product.value.id);

  saving.value = false;

  if (error) console.error(error);
  else alert("Zapisano 🎉");
};

const uploadPhotos = async (event) => {
  const files = event.target.files;
  if (!files.length) return;

  const folder = product.value.sku;

  for (const file of files) {
    const filename = `${Date.now()}-${file.name}`;

    // Upload pojedynczego pliku
    const { data, error } = await $supabase.storage
      .from("products")
      .upload(`${folder}/${filename}`, file);

    if (error) {
      console.error("Upload error:", error);
      continue;
    }

    // Pobranie publicznego URL
    const publicUrl = $supabase.storage
      .from("products")
      .getPublicUrl(`${folder}/${filename}`).data.publicUrl;

    // Dodanie do listy zdjęć
    product.value.photos.push({
      url: publicUrl,
      alt: product.value.display_name,
    });
  }

  // Czyścimy input po wysłaniu
  event.target.value = "";
};

// 🚀 Usuwanie zdjęcia
const removePhoto = (index) => {
  product.value.photos.splice(index, 1);
};
</script>

<template>
  <div class="admin-edit">
    <NuxtLink to="/admin/products" class="back-link">← Powrót</NuxtLink>

    <h1>Edytuj produkt</h1>

    <div v-if="!product">Ładowanie...</div>

    <div v-else class="form">
      <!-- 🎯 SEKCJA 1: Podstawowe informacje -->
      <section>
        <h2>Podstawowe informacje</h2>

        <label>SKU</label>
        <input v-model="product.sku" />

        <label>Nazwa</label>
        <input v-model="product.display_name" />

        <label>URL</label>
        <input v-model="product.url" />

        <label>Kategorie (oddzielone przecinkami)</label>
        <input
          v-model="product.categories"
          @input="
            product.categories = $event.target.value
              .split(',')
              .map((c) => c.trim())
          "
        />

        <label>Kolor (HEX)</label>
        <input v-model="product.color" type="color" />

        <label>Opis (HTML)</label>
        <textarea v-model="product.description"></textarea>

        <label>Opis dostawy (HTML)</label>
        <textarea v-model="product.delivery_description"></textarea>

        <label>Ukryty produkt?</label>
        <input type="checkbox" v-model="product.hidden" />
      </section>

      <!-- 🎯 SEKCJA 2: Ceny -->
      <section>
        <h2>Ceny</h2>

        <label>Cena PLN</label>
        <input v-model="product.prices.pln.base_price" />
      </section>

      <!-- 🎯 SEKCJA 3: Parametry techniczne -->
      <section>
        <h2>Parametry techniczne</h2>

        <div
          v-for="(row, idx) in product.technical_details"
          :key="idx"
          class="row"
        >
          <input v-model="row.name" placeholder="Nazwa" />
          <input v-model="row.value" placeholder="Wartość" />
          <button @click="product.technical_details.splice(idx, 1)">🗑</button>
        </div>

        <button
          class="small-btn"
          @click="product.technical_details.push({ name: '', value: '' })"
        >
          ➕ Dodaj parametr
        </button>
      </section>

      <!-- 🎯 SEKCJA 4: Zdjęcia -->
      <section>
        <h2>Zdjęcia</h2>

        <div class="photos">
          <draggable
            v-model="product.photos"
            item-key="url"
            class="photos-grid"
            ghost-class="drag-ghost"
            animation="200"
          >
            <template #item="{ element, index }">
              <div class="photo-box">
                <img :src="element.url" class="photo-img" />
                <button class="delete-btn" @click="removePhoto(index)">
                  Usuń
                </button>
              </div>
            </template>
          </draggable>
        </div>

        <input type="file" multiple @change="uploadPhotos" />
      </section>

      <!-- 🎯 ZAPIS -->
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

.photos {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.photo-box {
  width: 120px;
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 8px;
  text-align: center;
}

.photo-box img {
  width: 100%;
  border-radius: 4px;
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

.save-btn:disabled {
  opacity: 0.5;
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
  height: auto;
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

.drag-ghost {
  opacity: 0.4;
}
</style>
