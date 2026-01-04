<script setup>
defineProps({
  totalPrice: Number,
  totalQuantity: Number
})
</script>

<template>
  <aside class="summary">
    <h2 class="mb-6">Podsumowanie</h2>

    <div class="row">
      <span>Ilość produktów</span>
      <strong>{{ totalQuantity }}</strong>
    </div>

    <div class="row total">
      <span>Wartość zamówienia</span>
      <strong>{{ totalPrice.toFixed(2) }} zł</strong>
    </div>

    <NuxtLink href="/zamow">
      <button  class="checkout">
        Przejdź do zamówienia
      </button>
      
    </NuxtLink>
  </aside>
</template>

<style scoped>
.summary {
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 4;
  background: #fafafa;
  position: sticky;
  top: 20px;
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

.checkout {
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
