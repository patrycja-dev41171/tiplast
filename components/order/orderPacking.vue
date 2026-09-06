<template>
  <div class="row-3 mb-8 mt-8">

    <!-- ── Toolbar ─────────────────────────────────────────────────────────── -->
    <div class="toolbar">
      <button v-if="!editing" class="edit-btn" @click="startEdit">
        <v-icon icon="mdi-pencil-outline" size="16" />Edytuj paczki
      </button>
      <template v-else>
        <button class="btn-cancel" @click="cancelEdit" :disabled="saving">Anuluj</button>
        <button class="btn-save" @click="save" :disabled="saving">
          <v-icon v-if="saving" icon="mdi-loading" size="16" style="margin-right:6px;animation:spin 1s linear infinite" />
          {{ saving ? 'Zapisywanie...' : 'Zapisz zmiany' }}
        </button>
      </template>
    </div>

    <p v-if="saveError" class="save-error">{{ saveError }}</p>

    <!-- ── PODGLĄD ─────────────────────────────────────────────────────────── -->
    <template v-if="!editing">
      <div v-for="(parcel, index) in order.order_parcels" :key="parcel.id" class="parcel">
        <div class="parcel-header">
          <strong>Paczka {{ index + 1 }}</strong>
          <span class="parcel-id">ID: {{ parcel.id }}</span>
        </div>

        <div class="parcel-info">
          <div><strong>Wymiary:</strong> {{ parcel.length }} × {{ parcel.width }} × {{ parcel.height }} cm</div>
          <div><strong>Max Waga:</strong> {{ parcel.weight }} kg</div>
        </div>

        <div class="parcel-products">
          <h4>Produkty w paczce</h4>
          <table>
            <thead>
              <tr><th></th><th>Produkt</th><th>Ilość</th></tr>
            </thead>
            <tbody>
              <tr v-for="item in parcel.order_parcel_items" :key="item.id">
                <td>
                  <img v-if="item.product?.photos?.length" :src="item.product.photos[0].url" :alt="item.product.display_name" />
                </td>
                <td>
                  <NuxtLink :to="`/produkt/${item.product.url}`" target="_blank">{{ item.product.display_name }}</NuxtLink>
                </td>
                <td>{{ item.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="parcel.order_packing_instructions" class="parcel-instructions">
          <h4>Instrukcje pakowania:</h4>
          <div v-if="parcel.order_packing_instructions.note">
            <strong>{{ parcel.order_packing_instructions.note }}</strong>
          </div>
        </div>
      </div>
    </template>

    <!-- ── EDYCJA ──────────────────────────────────────────────────────────── -->
    <template v-else>
      <div v-for="(parcel, pIndex) in localParcels" :key="pIndex" class="parcel parcel--edit">
        <div class="parcel-header">
          <strong>Paczka {{ pIndex + 1 }}</strong>
          <button class="parcel-remove-btn" @click="removeParcel(pIndex)" title="Usuń paczkę">
            <v-icon icon="mdi-close" size="16" />
          </button>
        </div>

        <div class="parcel-dims-row">
          <input v-model.number="parcel.length" type="number" min="1" class="dim-input" placeholder="Dł." title="Długość (cm)" />
          <span class="sep">×</span>
          <input v-model.number="parcel.width" type="number" min="1" class="dim-input" placeholder="Szer." title="Szerokość (cm)" />
          <span class="sep">×</span>
          <input v-model.number="parcel.height" type="number" min="1" class="dim-input" placeholder="Wys." title="Wysokość (cm)" />
          <span class="unit">cm</span>
          <input v-model.number="parcel.weight" type="number" min="0.1" step="0.1" class="dim-input weight-input" placeholder="Waga" title="Waga (kg)" />
          <span class="unit">kg</span>
        </div>

        <table class="items-edit">
          <thead>
            <tr><th>Produkt</th><th class="col-num">Ilość</th><th class="col-del"></th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, iIndex) in parcel.items" :key="iIndex">
              <td>
                <select v-model="item.product_id" class="ie-select">
                  <option :value="null" disabled>Wybierz produkt</option>
                  <option v-for="p in productOptions" :key="p.product_id" :value="p.product_id">{{ p.display_name }}</option>
                </select>
              </td>
              <td>
                <input v-model.number="item.quantity" type="number" min="1" step="1" class="ie-input ie-input--sm" />
              </td>
              <td><button class="ie-del" @click="parcel.items.splice(iIndex, 1)" tabindex="-1">×</button></td>
            </tr>
          </tbody>
        </table>
        <button class="ie-add" @click="parcel.items.push({ product_id: productOptions[0]?.product_id ?? null, quantity: 1 })">
          + Dodaj produkt do paczki
        </button>

        <textarea v-model="parcel.note" class="ie-textarea" rows="2" placeholder="Instrukcje pakowania (opcjonalne)..." />
      </div>

      <button class="btn-add-parcel" @click="addParcel">
        <v-icon icon="mdi-plus" size="16" />Dodaj paczkę
      </button>

      <!-- ── Podsumowanie i przeliczenie kosztów ───────────────────────────── -->
      <div class="totals-box">
        <div class="totals-row">
          <span>Wartość produktów</span>
          <span>{{ productsTotal.toFixed(2) }} zł</span>
        </div>
        <div class="totals-row">
          <span>Koszt wysyłki</span>
          <span>{{ effectiveShippingPrice.toFixed(2) }} zł<span v-if="!selectedShipping" class="totals-hint"> (bez zmian)</span></span>
        </div>
        <div class="totals-row totals-row--grand">
          <span>Razem</span>
          <span>{{ (productsTotal + effectiveShippingPrice).toFixed(2) }} zł</span>
        </div>

        <button class="btn-recalc-shipping" :disabled="shippingLoading" @click="recalcShipping">
          <v-icon :icon="shippingLoading ? 'mdi-loading' : 'mdi-calculator-variant-outline'" size="16" :class="{ spin: shippingLoading }" />
          {{ shippingLoading ? 'Przeliczanie...' : 'Przelicz koszt wysyłki' }}
        </button>
        <p v-if="shippingError" class="shipping-err">{{ shippingError }}</p>

        <div v-if="shippingMethods.length" class="shipping-options">
          <div v-for="method in shippingMethods" :key="method.id" class="shipping-option"
            :class="{ active: selectedShipping?.id === method.id }" @click="selectedShipping = method">
            <strong>{{ method.label }}</strong>
            <span>{{ Number(method.price_gross).toFixed(2) }} zł</span>
          </div>
          <div class="shipping-option" :class="{ active: selectedShipping?.id === 'custom' }" @click="selectedShipping = { id: 'custom', label: customShippingLabel, price_gross: 0 }">
            <strong>Inna (wpisz ręcznie)</strong>
          </div>
          <div v-if="selectedShipping?.id === 'custom'" class="custom-shipping">
            <input v-model="customShippingLabel" class="ie-input" placeholder="Nazwa metody wysyłki" />
            <input v-model.number="customShippingPrice" type="number" min="0" step="0.01" class="ie-input" placeholder="Cena (zł)" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updated'])

const { updateOrderItemQuantity, replaceOrderParcels, updateOrderShipping } = useOrder()

const editing   = ref(false)
const saving    = ref(false)
const saveError = ref('')

const localParcels = ref([])

const productOptions = computed(() => {
  const seen = new Map()
  for (const item of props.order.order_items ?? []) {
    if (!seen.has(item.product.id)) {
      seen.set(item.product.id, {
        product_id: item.product.id,
        display_name: item.product.display_name,
        price_snapshot: Number(item.price_snapshot),
      })
    }
  }
  return [...seen.values()]
})

const syncLocalParcels = () => {
  localParcels.value = (props.order.order_parcels ?? []).map(parcel => ({
    length: parcel.length,
    width: parcel.width,
    height: parcel.height,
    weight: parcel.weight,
    note: parcel.order_packing_instructions?.note ?? '',
    items: (parcel.order_parcel_items ?? []).map(i => ({
      product_id: i.product_id,
      quantity: i.quantity,
    })),
  }))
}

const startEdit = () => {
  syncLocalParcels()
  shippingMethods.value = []
  selectedShipping.value = null
  shippingError.value = ''
  saveError.value = ''
  editing.value = true
}

const cancelEdit = () => {
  editing.value = false
  saveError.value = ''
}

const addParcel = () => {
  localParcels.value.push({ length: '', width: '', height: '', weight: '', note: '', items: [] })
}
const removeParcel = (i) => localParcels.value.splice(i, 1)

// product_id -> suma ilości we wszystkich paczkach
const perProductQuantity = computed(() => {
  const map = {}
  for (const parcel of localParcels.value) {
    for (const item of parcel.items) {
      if (!item.product_id) continue
      map[item.product_id] = (map[item.product_id] || 0) + (Number(item.quantity) || 0)
    }
  }
  return map
})

const productsTotal = computed(() =>
  productOptions.value.reduce((sum, p) => sum + (perProductQuantity.value[p.product_id] || 0) * p.price_snapshot, 0)
)

// ── Przeliczanie kosztu wysyłki ─────────────────────────────────────────────
const shippingMethods     = ref([])
const shippingLoading     = ref(false)
const shippingError       = ref('')
const selectedShipping    = ref(null)
const customShippingLabel = ref('')
const customShippingPrice = ref(0)

const currentShippingPrice = computed(() => Number(props.order.order_shipping_details?.price_gross ?? 0))

const effectiveShippingPrice = computed(() => {
  if (!selectedShipping.value) return currentShippingPrice.value
  if (selectedShipping.value.id === 'custom') return Number(customShippingPrice.value) || 0
  return Number(selectedShipping.value.price_gross) || 0
})

const recalcShipping = async () => {
  shippingLoading.value  = true
  shippingError.value    = ''
  shippingMethods.value  = []
  selectedShipping.value = null

  try {
    const { methods } = await $fetch('/api/shipping/calculate', {
      method: 'POST',
      body: {
        parcels: localParcels.value.map(p => ({ length: p.length, width: p.width, height: p.height, weight: p.weight })),
        cod: !!props.order.order_payment_details?.cod,
        service: ['dpd', 'inpost'],
        cart: {
          total_price: productsTotal.value,
          firstname: props.order.firstname,
          lastname:  props.order.lastname,
          company:   props.order.company,
          street:    props.order.street,
          zip:       props.order.zip,
          city:      props.order.city,
          country:   props.order.country || 'PL',
          email:     props.order.email,
          phone:     props.order.phone,
        },
      },
    })
    shippingMethods.value = methods
    if (!methods.length) shippingError.value = 'Brak dostępnych metod wysyłki.'
  } catch (e) {
    shippingError.value = e?.data?.statusMessage ?? e?.message ?? 'Błąd pobierania cen wysyłki.'
  } finally {
    shippingLoading.value = false
  }
}

// ── Zapis ─────────────────────────────────────────────────────────────────
const validate = () => {
  if (!localParcels.value.length) return 'Zamówienie musi mieć przynajmniej jedną paczkę.'

  for (const [i, parcel] of localParcels.value.entries()) {
    if (!parcel.length || !parcel.width || !parcel.height || !parcel.weight)
      return `Paczka ${i + 1}: uzupełnij wymiary i wagę.`
    if (!parcel.items.length)
      return `Paczka ${i + 1}: dodaj przynajmniej jeden produkt.`
    for (const item of parcel.items) {
      if (!item.product_id) return `Paczka ${i + 1}: wybierz produkt dla każdej pozycji.`
      if (!item.quantity || item.quantity < 1) return `Paczka ${i + 1}: ilość musi być większa od 0.`
    }
  }

  for (const p of productOptions.value) {
    if (!perProductQuantity.value[p.product_id]) {
      return `Produkt "${p.display_name}" musi mieć przynajmniej 1 sztukę przypisaną do paczki.`
    }
  }

  if (selectedShipping.value?.id === 'custom' && !customShippingLabel.value.trim())
    return 'Podaj nazwę niestandardowej metody wysyłki.'

  return ''
}

const save = async () => {
  const err = validate()
  if (err) { saveError.value = err; return }

  saving.value = true
  saveError.value = ''
  try {
    for (const item of props.order.order_items ?? []) {
      const newQty = perProductQuantity.value[item.product.id]
      if (newQty && Number(newQty) !== Number(item.quantity)) {
        await updateOrderItemQuantity(item.id, Number(newQty))
      }
    }

    await replaceOrderParcels(props.order.order_id, localParcels.value)

    if (selectedShipping.value) {
      await updateOrderShipping(props.order.order_id, {
        price_gross: effectiveShippingPrice.value,
        price_net:   effectiveShippingPrice.value,
        service:     selectedShipping.value.id === 'custom' ? customShippingLabel.value.trim() : (selectedShipping.value.service ?? 'custom'),
        type:        selectedShipping.value.id === 'custom' ? null : (selectedShipping.value.type ?? null),
      })
    }

    editing.value = false
    emit('updated')
  } catch (e) {
    saveError.value = e?.message ?? 'Wystąpił błąd podczas zapisywania.'
  }
  saving.value = false
}
</script>

<style scoped lang="scss">
.row-3 {
  background-color: rgb(244, 244, 244);
  border-radius: 4px;
  padding: 24px 20px;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 14px;
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;

  &:hover { background: #f9fafb; border-color: #d1d5db; }
}

.btn-cancel {
  padding: 8px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  color: #374151;
  cursor: pointer;

  &:hover:not(:disabled) { background: #f9fafb; }
  &:disabled { opacity: .5; cursor: default; }
}

.btn-save {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #32aa27;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) { background: #279620; }
  &:disabled { opacity: .6; cursor: default; }
}

.save-error {
  font-size: 13px;
  color: #ef4444;
  margin-bottom: 12px;
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
  align-items: center;
  font-size: 17px;
  margin-bottom: 12px;

  .parcel-id { color: #6b7280; font-size: 13px; }
}

.parcel-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 40px;
  font-size: 16px;
  margin-bottom: 16px;
}

.parcel-products {
  margin-bottom: 16px;

  table { margin: 20px 0 30px 0; width: 50%; border-collapse: collapse; font-size: 16px; }
  th { text-align: left; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
  td { padding: 8px 0; vertical-align: middle; }
  img { width: 58px; height: 58px; object-fit: cover; border-radius: 4px; margin-right: 8px; }
  a { color: #2563eb; text-decoration: none; &:hover { text-decoration: underline; } }
}

.parcel-instructions {
  background: #f9fafb;
  padding: 12px;
  border-radius: 4px;
  font-size: 16px;

  h4 { margin-bottom: 6px; }
  div { margin-bottom: 4px; }
}

// ── Edycja ────────────────────────────────────────────────────────────────
.parcel-remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;

  &:hover { background: #fee2e2; color: #ef4444; }
}

.parcel-dims-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.dim-input {
  width: 70px;
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
  outline: none;

  &:focus { border-color: #32aa27; }
}

.weight-input { width: 76px; }
.sep { font-size: 12px; color: #9ca3af; }
.unit { font-size: 12px; color: #9ca3af; margin-right: 4px; }

.items-edit {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;

  th { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; padding: 4px 4px 6px; border-bottom: 1px solid #e5e7eb; text-align: left; }
  td { padding: 4px; vertical-align: middle; border-bottom: 1px solid #f3f4f6; }
  .col-num { width: 80px; }
  .col-del { width: 28px; }
}

.ie-select, .ie-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  background: #fff;

  &:focus { border-color: #32aa27; }
}
.ie-input--sm { width: 76px; text-align: right; }

.ie-del {
  width: 22px; height: 22px; border: none; background: #fee2e2; color: #ef4444;
  border-radius: 4px; cursor: pointer; font-size: 14px; line-height: 1;
  &:hover { background: #fecaca; }
}

.ie-add {
  background: none; border: 1px dashed #d1d5db; border-radius: 6px; padding: 6px 10px;
  font-size: 12px; color: #6b7280; cursor: pointer; margin-bottom: 10px;
  &:hover { background: #f9fafb; color: #374151; }
}

.ie-textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  outline: none;

  &:focus { border-color: #32aa27; }
}

.btn-add-parcel {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px dashed #9ca3af;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover { background: #f9fafb; }
}

// ── Podsumowanie ──────────────────────────────────────────────────────────
.totals-box {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #374151;
  padding: 4px 0;

  &--grand { font-weight: 700; font-size: 16px; color: #111; border-top: 2px solid #e5e7eb; margin-top: 6px; padding-top: 10px; }
}

.totals-hint { font-size: 11px; color: #9ca3af; }

.btn-recalc-shipping {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #86efac;
  border-radius: 8px;
  background: #f0fdf4;
  color: #166534;
  font-size: 13px;
  cursor: pointer;
  margin-top: 12px;

  &:hover:not(:disabled) { background: #dcfce7; }
  &:disabled { opacity: .6; cursor: default; }
}

.shipping-err { font-size: 13px; color: #ef4444; margin-top: 8px; }

.shipping-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}

.shipping-option {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;

  &.active { border-color: #32aa27; background: #f0fdf4; }
  &:hover:not(.active) { background: #f9fafb; }
}

.custom-shipping {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 4px;
}

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin .8s linear infinite; }
</style>
