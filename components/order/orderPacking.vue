<template>
  <div class="row-3 mb-8 mt-8">
    <div
      v-for="(parcel, index) in order.order_parcels"
      :key="parcel.id"
      class="parcel"
    >
      <!-- HEADER -->
      <div class="parcel-header">
        <strong>Paczka {{ index + 1 }}</strong>
        <span class="parcel-id">ID: {{ parcel.id }}</span>
      </div>

      <!-- INFO -->
      <div class="parcel-info">
        <div><strong>Wymiary:</strong> {{ parcel.length }} × {{ parcel.width }} × {{ parcel.height }} cm</div>
        <div><strong>Max Waga:</strong> {{ parcel.weight }} kg</div>
      </div>

      <!-- PRODUCTS -->
      <div class="parcel-products">
        <h4>Produkty w paczce</h4>

        <table>
          <thead>
            <tr>
              <th></th>
              <th>Produkt</th>
              <th>Ilość</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in parcel.order_parcel_items"
              :key="item.id"
            >
              <td>
                <img
                  v-if="item.product?.photos?.length"
                  :src="item.product.photos[0].url"
                  :alt="item.product.display_name"
                />
              </td>
              <td>
                <NuxtLink
                  :to="`/produkt/${item.product.url}`"
                  target="_blank"
                >
                  {{ item.product.display_name }}
                </NuxtLink>
              </td>
              <td>{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PACKING INSTRUCTIONS -->
      <div
        v-if="parcel.order_packing_instructions"
        class="parcel-instructions"
      >
        <h4>Instrukcje pakowania:</h4>
        <div v-if="parcel.order_packing_instructions.note">
          <strong>{{ parcel.order_packing_instructions.note }}</strong> 
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})
</script>

<style scoped lang="scss">
    .row-3 {
  background-color: rgb(244, 244, 244);
  border-radius: 4px;
  padding: 24px 20px;
}

.parcel {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
}

.parcel-header {
  display: flex;
  justify-content: space-between;
  font-size: 17px;
  margin-bottom: 12px;

  .parcel-id {
    color: #6b7280;
    font-size: 13px;
  }
}

.parcel-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 40px;
  font-size: 15px;
  margin-bottom: 16px;
}

.parcel-products {
  margin-bottom: 16px;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  th {
    text-align: left;
    padding-bottom: 6px;
    border-bottom: 1px solid #e5e7eb;
  }

  td {
    padding: 8px 0;
    vertical-align: middle;
  }

  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 8px;
  }

  a {
    color: #2563eb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.parcel-instructions {
  background: #f9fafb;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;

  h4 {
    margin-bottom: 6px;
  }

  div {
    margin-bottom: 4px;
  }
}

</style>