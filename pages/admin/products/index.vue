<script setup>
definePageMeta({
  middleware: "admin-client",
});

const { $supabase } = useNuxtApp();

const products = ref([]);
const loading = ref(true);

const fetchProducts = async () => {
  const { data, error } = await $supabase.from("products").select("*");

  if (error) {
    console.error(error);
  } else {
    products.value = data.sort((a, b) => a.sku.localeCompare(b.sku));
  }

  loading.value = false;
};

onMounted(fetchProducts);
</script>

<template>
  <div class="admin-products">
    <h1>Produkty</h1>

    <NuxtLink to="/admin/products/new" class="add-btn">
      + Dodaj produkt
    </NuxtLink>

    <div v-if="loading">Ładowanie produktów...</div>

    <table v-else class="products-table">
      <thead>
        <tr>
          <th>Nazwa</th>
          <th>SKU</th>
          <th>Cena</th>
          <th>Kategorie</th>
          <th>Widoczny</th>
          <th>Kolor</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.display_name }}</td>
          <td>{{ product.sku }}</td>
          <td>
            {{ product.prices.pln.base_price }} {{ product.prices.pln.symbol }}
          </td>
          <td>{{ product.categories?.join(", ") }}</td>
          <td>
            <span :class="product.hidden ? 'hidden-flag' : 'visible-flag'">
              {{ product.hidden ? "NIE" : "TAK" }}
            </span>
          </td>
          <td>
            <div
              class="color"
              :style="{ backgroundColor: product.color }"
            ></div>
          </td>
          <td>
            <NuxtLink :to="`/admin/products/${product.id}`" class="edit-link">
              Edytuj
            </NuxtLink>
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
  color: #059669; /* zielony */
  font-weight: 600;
}

.hidden-flag {
  color: #dc2626; /* czerwony */
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
</style>
