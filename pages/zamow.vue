<template>
    <section v-if="cart" class="cart-page mt-10">
        <h1 class="mb-6">Finalizacja zamówienia</h1>

        <div class="cart-layout">
            <div>
                <CheckoutForm v-if="step === 1 && cart" :cart="cart" ref="checkoutForm" @submit="onCustomerSubmit" />
                <CheckoutShipping v-if="step === 2" ref="shippingRef" :cart="cart" @submit="onShippingSubmit" @update_cart="updateCart" />
            </div>

            <CheckoutSummary
  :totalPrice="cart.total_price"
  :totalQuantity="cart.total_quantity"
  :cart="cart"
  :buttonLabel="step === 1 ? 'Dalej' : 'Złóż zamówienie'"
  @place-order="placeOrder"
/>
        </div>
    </section>
</template>

<script setup>
import CheckoutForm from "@/components/CheckoutForm.vue"

const step = ref(1) // 1 = adres, 2 = wysyłka


const { getCart, updateCartById } = useCarts()
const cart = ref(null)

onMounted(async () => {
    cart.value = await getCart()
})

const checkoutForm = ref(null)
const shippingRef = ref(null)
const customerData = ref(null)
const shippingData = ref(null)

const updateCart = async () => {
    cart.value = await getCart()
}

const placeOrder = () => {
  if (step.value === 1) {
    checkoutForm.value?.submit()
    return
  }

  if (step.value === 2) {
    shippingRef.value?.submit()
  }
}


const onCustomerSubmit = async (data) => {
  customerData.value = data
  await updateCartById(data)
  cart.value = await getCart()
  step.value = 2 
}

const onShippingSubmit = (data) => {
    shippingData.value = data
    tryPlaceOrder()
}

const tryPlaceOrder = () => {
    if (!customerData.value || !shippingData.value) return

    // TU masz JUŻ WSZYSTKO
    console.log("PLACE ORDER FINAL", {
        customer: customerData.value,
        shipping: shippingData.value,
        cart: cart.value
    })

    // 🔜 dalej:
    // await createOrderFromCart(...)
    // navigateTo('/order/success')
}

</script>


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
