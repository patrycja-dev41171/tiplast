<script setup>
definePageMeta({
  layout: 'admin',
  middleware: "admin-client",
});

const {getAllProducts, getLastSku, getProductsByUrlPrefix, addProduct, deleteProductsById} = useProducts()
const {getAllCategories} = useCategories()

const products = ref([]);
const loading = ref(true);

const fetchProducts = async () => {
  const { data, error } = await getAllProducts();

  if (error) {
    console.error(error);
  } else {
    products.value = data.sort((a, b) => a.sku.localeCompare(b.sku));
  }

  loading.value = false;
};

const categories = ref([]);
const loadCategories = async () => {
  const { data, error } = await getAllCategories("id");

  if (!error) categories.value = data;
};

onMounted(async () => {
  await fetchProducts();
  await loadCategories();
});

const categoriesMap = computed(() => {
  const map = {};
  categories.value.forEach((c) => {
    map[c.id] = c.display_name;
  });
  return map;
});

const getCategoryNames = (ids) => {
  if (!ids || !Array.isArray(ids)) return [];
  return ids.map((id) => categoriesMap.value[id] || id);
};

const getNextSku = async () => {
  const { data, error } = await getLastSku();

  if (error) {
    console.error(error);
    return "001";
  }

  const lastSku = data?.[0]?.sku;
  if (!lastSku) return "001";

  const nextNumber = parseInt(lastSku, 10) + 1;
  return String(nextNumber).padStart(3, "0");
};

const getNextUrl = async (baseUrl) => {
  const { data, error } = await getProductsByUrlPrefix(baseUrl)

  if (error) {
    console.error(error);
    return `${baseUrl}-copy`;
  }

  if (!data.length) return baseUrl;

  let maxNum = 1;

  data.forEach((p) => {
    const match = p.url.match(/-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });

  return `${baseUrl}-${maxNum + 1}`;
};



const duplicateProduct = async (product) => {
  if (!confirm("Na pewno skopiować ten produkt?")) return;

  const newSku = await getNextSku();
  const newUrl = await getNextUrl(product.url);

  const newProduct = JSON.parse(JSON.stringify(product));

  delete newProduct.id;
  delete newProduct.created_at;
  delete newProduct.updated_at;

  newProduct.sku = newSku;
  newProduct.url = newUrl;

  const { data, error } = await addProduct([newProduct])

  if (error) {
    console.error(error);
    alert("Błąd podczas duplikacji produktu.");
  } else {
    alert("Produkt zduplikowany!");
    await fetchProducts();
  }
};

const deleteProduct = async (productId) => {
  if (!confirm("Czy na pewno chcesz usunąć ten produkt?")) return;

  const { error } = await deleteProductsById(productId)

  if (error) {
    console.error(error);
    alert("Błąd podczas usuwania produktu.");
  } else {
    alert("Produkt został usunięty.");
    await fetchProducts();
  }
};


</script>

<template>
  <div class="admin-products">
    <AdminPageHeader text="Produkty" />

    <NuxtLink to="/admin/products/new" class="add-btn">
      + Dodaj produkt
    </NuxtLink>

    <div v-if="loading">Ładowanie produktów...</div>

    <table v-else class="products-table">
      <thead>
        <tr>
          <th></th>
          <th>Nazwa</th>
          <th>SKU</th>
          <th>Cena</th>
          <th>Kategorie</th>
          <th>Pakowanie</th>
          <th>Widoczny</th>
          <th>Kolor</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>
            <v-img aspect-ratio="16/9" cover :src="product.photos[0]?.url || ''" class="product_photo"></v-img>
          </td>
          <td class="link">
          <NuxtLink :to="`/admin/products/view/${product.id}`">{{ product.display_name }}</NuxtLink>
          </td>
          <td>{{ product.sku }}</td>
          <td>
            {{ product.prices.pln.base_price }} {{ product.prices.pln.symbol }}
          </td>
          <td>{{ getCategoryNames(product.categories).join(", ") }}</td>
          <td class="centered">
             <v-icon v-if="!product.packaging_options?.length" icon="mdi-alert-box" color="red" size="x-large"/>
             <v-icon v-else icon="mdi-checkbox-marked" color="green"  size="x-large"/>
            </td>
          <td>
            <span :class="product.hidden ? 'hidden-flag' : 'visible-flag'">
              {{ product.hidden ? "NIE" : "TAK" }}
            </span>
          </td>
          <td>
            <div class="color" :style="{ backgroundColor: product.color }"></div>
          </td>
          <td class="buttons">
            <v-menu>
              <template #activator="{ props }">
                <v-btn icon v-bind="props" color="#2664eb">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                 <v-list-item :to="`/admin/products/${product.id}`">
                  <v-list-item-title>Edytuj</v-list-item-title>
                </v-list-item>
                <v-list-item  :to="`/admin/products/pakowanie/${product.id}`">
                  <v-list-item-title>Reguły pakowania</v-list-item-title>
                </v-list-item>
                <v-list-item @click="duplicateProduct(product)">
                  <v-list-item-title>Duplikuj</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteProduct(product.id)">
                  <v-list-item-title class="delete">Usuń</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.admin-products {
  padding: 30px;
}

.admin-products h1 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}

.add-btn {
  display: inline-block;
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 600;
  transition: 0.2s background;
}

.add-btn:hover {
  background: #1e4fc7;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.products-table th {
  text-align: left;
  padding: 14px;
  background: #f7f7f7;
  font-weight: 600;
  border-bottom: 1px solid #e3e3e3;
}

.products-table td {
  padding: 14px;
  border-bottom: 1px solid #e5e5e5;
}

.products-table tr:last-child td {
  border-bottom: none;
}

.edit-link {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

.edit-link:hover {
  color: #1e4fc7;
}

.visible-flag {
  color: #059669;
  /* zielony */
  font-weight: 600;
}

.hidden-flag {
  color: #dc2626;
  /* czerwony */
  font-weight: 600;
}

/* Responsywność */
@media (max-width: 600px) {

  .products-table th,
  .products-table td {
    padding: 10px;
    font-size: 14px;
  }

  .admin-products h1 {
    font-size: 22px;
  }
}

.color {
  width: 20px;
  height: 20px;
  border: 2px solid black;
}

.product_photo {
  width: 80px;
  height: 80px;
}

.link {
  a {
    color: #1e4fc7;
  }
  a:hover {
    text-decoration: underline;
  }
}
</style>
