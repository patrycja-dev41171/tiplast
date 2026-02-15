<script setup>
import { onMounted, ref } from "vue"
import { useCarts } from "~/composables/useCarts"

import CartItem from "~/components/cart/CartItem.vue"
import CartSummary from "~/components/cart/CartSummary.vue"

const { getCart } = useCarts()

const cart = ref(null)
const loading = ref(true)

const basketQty = useCookie('cart_quantity', {
  default: () => 0,
  maxAge: 60 * 60 * 24 * 30,
  sameSite: 'lax',
})

const basketTotal = useCookie('cart_total', {
  default: () => 0,
  maxAge: 60 * 60 * 24 * 30,
  sameSite: 'lax',
})

const cartId = useCookie('cart_id', {
  default: () => 0,
  maxAge: 60 * 60 * 24 * 30,
  sameSite: 'lax',
})

const loadCart = async () => {
  loading.value = true
  try {
    cart.value = await getCart()
    basketQty.value = cart.value.total_quantity
    basketTotal.value = cart.value.total_price
  } catch (err) {
    basketQty.value = null
    basketTotal.value = null
    cartId.value = null
  }

  loading.value = false
}

onMounted(loadCart)
</script>

<template>
  <section class="cart-page mt-10 ">
    <h1 class="mb-6">Twój koszyk</h1>

    <div v-if="loading">Ładowanie koszyka…</div>

    <div v-else-if="!cart || cart.items.length === 0">
      <p>Twój koszyk jest pusty.</p>
    </div>

    <div v-else class="cart-layout">
      <!-- LISTA PRODUKTÓW -->
      <div class="cart-items">
        <CartItem v-for="item in cart.items" :key="item.id" :item="item" @update="loadCart" @remove="loadCart" />
      </div>

      <!-- PODSUMOWANIE -->
      <CartSummary :totalPrice="cart.total_price" :totalQuantity="cart.total_quantity" />
    </div>
  </section>
</template>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 50px;
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}
</style>
