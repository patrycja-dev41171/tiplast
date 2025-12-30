<script setup>
import { ref, watch } from "vue"
import { products } from "~/database/products/products"

const props = defineProps({
  productId: {
    type: String,
    required: true
  },
  productPrice: {
    type: String,
    required: true
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: Infinity
  }
})

const emit = defineEmits(["added"])

const { add, getCart } = useCarts()

const qty = ref(props.min)

// pilnujemy zakresu
watch(qty, (val) => {
  if (val < props.min) qty.value = props.min
  if (val > props.max) qty.value = props.max
})

const increase = () => {
  if (qty.value < props.max) qty.value++
}

const reduce = () => {
  if (qty.value > props.min) qty.value--
}

const addToCart = async () => {
    await add(props.productId, qty.value, props.productPrice)
    qty.value = 1
    const cart = await getCart()
    console.log(cart)
}
</script>

<template>
  <div class="add-to-cart">
    <div class="qty-control">
      <button @click="reduce" :disabled="qty <= min">−</button>

      <input
        type="number"
        v-model.number="qty"
        :min="min"
        :max="max"
      />

      <button @click="increase" :disabled="qty >= max">+</button>
    </div>

    <button class="add-btn" @click="addToCart">
      🛒 Dodaj do koszyka
    </button>
  </div>
</template>

<style scoped>
.add-to-cart {
  display: flex;
  gap: 12px;
  align-items: center;
}

.qty-control {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
}

.qty-control button {
  width: 32px;
  height: 36px;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  font-size: 18px;
}

.qty-control input {
  width: 50px;
  text-align: center;
  border: none;
  outline: none;
}

.add-btn {
  padding: 10px 16px;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.add-btn:hover {
  filter: brightness(95%);
}
</style>
