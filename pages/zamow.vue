<template>
  <section v-if="cart" class="cart-page mt-5 mt-mb-10">
    <h1 class="mb-6">Finalizacja zamówienia</h1>

    <CheckoutSteps :currentStep="step" @change="step = $event" />

    <div class="cart-layout">
      <div>
        <CheckoutForm v-if="step === 1 && cart" :cart="cart" ref="checkoutForm" @submit="onCustomerSubmit" />
        <CheckoutShipping v-if="step === 2" ref="shippingRef" :cart="cart" @submit="onShippingSubmit"
          @update_cart="updateCart" />
        <CheckoutPayment v-if="step === 3" ref="paymentRef" :cart="cart" @submit="onPaymentSubmit" />
      </div>

      <CheckoutSummary :totalPrice="cart.total_price" :totalQuantity="cart.total_quantity" :cart="cart"
        :buttonLabel="step === 1 || step === 2 ? 'Dalej' : 'Kupuję i płacę'" @place-order="placeOrder" />
    </div>
  </section>
</template>

<script setup>
import CheckoutForm from "@/components/CheckoutForm.vue"

const router = useRouter();
const step = ref(1) // 1 = adres, 2 = wysyłka

const { getCart, updateCartById } = useCarts()
const cart = ref(null)

onMounted(async () => {
  cart.value = await getCart()
})

const checkoutForm = ref(null)
const shippingRef = ref(null)
const paymentRef = ref(null)
const customerData = ref(null)
const shippingData = ref(null)
const paymentData = ref(null)

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
    return
  }

  if (step.value === 3) {
    paymentRef.value?.submit()
  }
}

const onCustomerSubmit = async (data) => {
  customerData.value = data
  await updateCartById(data)
  cart.value = await getCart()
  step.value = 2
}

const onShippingSubmit = async (data) => {
  shippingData.value = data
  step.value = 3
}

const onPaymentSubmit = async (data) => {
  paymentData.value = data
  tryPlaceOrder()
}

const { addOrder } = useOrder()

const clearCartCookies = () => {
  const basketQty = useCookie('cart_quantity')
  const basketTotal = useCookie('cart_total')
  const cartId = useCookie('cart_id')
  cartId.value = null
  basketTotal.value = null
  basketQty.value = null
}

const tryPlaceOrder = async () => {
  if (!customerData.value || !shippingData.value || !paymentData.value) return
  cart.value = await getCart()

  const order = await addOrder({
    customer: customerData.value,
    shipping: shippingData.value,
    payment: paymentData.value,
    cart: cart.value
  })

  if (order) {
    clearCartCookies()
    if(order.payment_status === "cod") {
      await useFetch('/api/order/placed_cod', { method:'POST', body: {order: order} })
    } else {
      await useFetch('/api/order/placed', { method:'POST', body: {order: order} })
    }
    router.replace(`/zamowienie/${order.order_id}`);
  } else {
    alert("Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.")
  }
}

</script>


<style scoped lang="scss">
.cart-page {
  max-width: 1200px;
  margin: auto;
  padding: 20px;

  h1 {
    font-size: 24px;
  }
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
