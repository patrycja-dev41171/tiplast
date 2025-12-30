<script setup>
const props = defineProps({
  item: Object
})

const emit = defineEmits(["update", "remove"])

const { updateItemQuantity, removeItem } = useCarts()

const qty = ref(props.item.quantity)

const changeQty = async (value) => {
  await updateItemQuantity(props.item.product.id, value)
  emit("update")
}

const remove = async () => {
  await removeItem(props.item.product.id)
  emit("remove")
}

const router = useRouter()

const goToProductPage = () => {
    router.push(`/produkt/${props.item.product.url}`)
}
</script>

<template>
  <div class="cart-item">
    <img
      :src="props.item.product.photos?.[0]?.url"
      alt=""
      class="thumb"
    />

    <div class="info">
      <h3 @click="goToProductPage">{{ props.item.product.display_name }}</h3>
      <p class="price">
        {{ props.item.price_snapshot.toFixed(2) }} zł / szt.
      </p>

      <div class="qty-controls">
        <button @click="changeQty(qty - 1)">−</button>
        <input
          type="number"
          min="1"
          v-model.number="qty"
          @change="changeQty(qty)"
        />
        <button @click="changeQty(qty + 1)">+</button>
      </div>
    </div>

    <div class="summary">
      <p class="line-total">
        {{ (qty * props.item.price_snapshot).toFixed(2) }} zł
      </p>
      <button class="remove" @click="remove">Usuń</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-item {
  display: grid;
  grid-template-columns: 90px 1fr auto;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.thumb {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}

.info h3 {
  margin: 0 0 6px;
  font-size: 16px;
  &:hover {
    color: #32aa27;
    cursor:pointer
  }
}

.price {
  font-size: 14px;
  color: #555;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.qty-controls input {
  width: 60px;
  text-align: center;
}

.qty-controls button {
  width: 32px;
  height: 32px;
}

.summary {
  text-align: right;
}

.line-total {
  font-weight: 600;
  margin-bottom: 6px;
}

.remove {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
  }

  .summary {
    text-align: left;
  }
}
</style>
