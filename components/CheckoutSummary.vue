<script setup>
defineProps({
  cart: Object,
  totalPrice: Number,
  totalQuantity: Number,
  buttonLabel: String
})
</script>

<template>
  <aside v-if="totalPrice" class="summary">
    <h2 class="mb-6">Podsumowanie</h2>

    <div class="row">
      <span>Ilość produktów</span>
      <strong>{{ totalQuantity }}</strong>
    </div>

    <div class="row">
      <span>Koszt przesyłki:</span>
      <strong>{{ cart?.cart_shipping_details?.price_gross?.toFixed(2) || 0.00}} zł</strong>
    </div>

    <div class="row total">
      <span>Do zapłaty:</span>
      <strong>{{ (totalPrice + Number(cart?.cart_shipping_details?.price_gross || '0')).toFixed(2) || 0.00 }} zł</strong>
    </div>

   <button class="submit-btn" @click="$emit('place-order')">
  {{ buttonLabel }}
</button>
  </aside>
</template>

<style scoped>
.summary {
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 4;
  background: #fafafa;
  position: sticky;
  top: 100px;
  align-self: flex-start;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.total {
  font-size: 18px;
}

.submit-btn {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  font-size: 17px;
  background: #32aa27;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0px;
  cursor: pointer;
}
</style>
