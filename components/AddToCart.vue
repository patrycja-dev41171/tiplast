<script setup>
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
  <div v-if="!max" class="add-to-cart">
    <div class="qty-control">
      <button @click="reduce" :disabled="qty <= min">−</button>

      <input
        v-model.number="qty"
        :min="min"
        :max="max"
      />

      <button @click="increase" :disabled="qty >= max">+</button>
    </div>

    <button class="add-btn" @click="addToCart">
     Dodaj do koszyka
    </button>
  </div>
  <div v-else >
    <p>Produkt jest w tym momencie niedostępny.</p>
    <button class="inquiry mt-3" @click="emit('inquiry')">Wyślij zapytanie</button>
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
  min-width: 300px;
  padding: 10px 16px;
  background: #32aa27;
  color: white;
  border-radius: 4px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

.inquiry {
    min-width: 300px;
  padding: 10px 16px;
  background: #7b7b7b;
  color: white;
  border-radius: 4px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

.add-btn:hover {
  filter: brightness(95%);
}
</style>
