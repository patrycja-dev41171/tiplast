<template>
  <section class="inventory-page">
    <AdminPageHeader text="Dane produktowe" />

    <section v-if="product" class="section">

      <!-- PODSTAWOWE INFO -->
      <div class="block">
        <h2>{{ product.display_name }}</h2>
        <p class="sku">SKU: <strong>{{ product.sku }}</strong></p>
        <p class="status">
          Status:
          <span :class="product.hidden ? 'hidden' : 'visible'">
            {{ product.hidden ? 'Ukryty' : 'Widoczny' }}
          </span>
        </p>
      </div>

      <!-- ZDJĘCIA -->
      <div class="block">
        <h3>Zdjęcia</h3>
        <div class="photos">
          <img
            v-for="(photo, i) in product.photos"
            :key="i"
            :src="photo.url"
            :alt="photo.alt"
          />
        </div>
      </div>

      <!-- CENA -->
      <div class="block">
        <h3>Cena</h3>
        <p>
          {{ product.prices.pln.base_price }} {{ product.prices.pln.symbol }}
        </p>
      </div>

      <!-- PARAMETRY TECHNICZNE -->
      <div class="block" v-if="product.technical_details?.length">
        <h3>Parametry techniczne</h3>
        <ul class="technical">
          <li v-for="(item, i) in product.technical_details" :key="i">
            <strong>{{ item.name }}:</strong> {{ item.value }}
          </li>
        </ul>
      </div>

      <!-- OPIS -->
      <div class="block">
        <h3>Opis produktu</h3>
        <div class="description" v-html="product.description" />
      </div>

      <!-- DOSTAWA -->
      <div class="block" v-if="product.delivery_description">
        <h3>Dostawa</h3>
        <div v-html="product.delivery_description" />
      </div>

      <!-- LINKI ZEWNĘTRZNE -->
      <div class="block">
        <h3>Linki</h3>
        <ul>
          <li>
            <a :href="`/produkt/${product.url}`" target="_blank">
              Podgląd produktu
            </a>
          </li>
          <li v-if="product.olx_url">
            <a :href="product.olx_url" target="_blank">
              Ogłoszenie OLX
            </a>
          </li>
        </ul>
      </div>

      <!-- META -->
      <div class="block meta">
        <p>Utworzono: {{ formatDate(product.created_at) }}</p>
        <p>Aktualizacja: {{ formatDate(product.updated_at) }}</p>
      </div>

    </section>
  </section>
</template>


<script setup>
definePageMeta({
  layout: 'admin',
  middleware: "admin-client",
});

const route = useRoute()

const { getProductById } = useProducts()
const { getStock } = useInventory()

const product = ref(null)
const stock = ref(null)

const loadData = async () => {
  const { data }= await getProductById(route.params.id)
  product.value = data;
  console.log(data)
  stock.value = await getStock(route.params.id) || { quantity: 0 }
}

onMounted(loadData)

const formatDate = (date) =>
  new Date(date).toLocaleString('pl-PL')

</script>

<style scoped>
   .inventory-page {
  padding: 30px;
}

.section {
  background-color: #ebebeb;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.block {
  margin-bottom: 32px;
}

.photos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.photos img {
  width: 100%;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.technical {
  list-style: none;
  padding: 0;
}

.technical li {
  padding: 4px 0;
}

.status .visible {
  color: green;
}

.status .hidden {
  color: red;
}

.meta {
  font-size: 13px;
  color: #666;
}


</style>