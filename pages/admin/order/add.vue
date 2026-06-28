<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin-client' });

const { addOrderManual } = useOrder();
const { getAllProducts } = useProducts();
const { calculateParcelsForItems } = useCarts();
const router = useRouter();

// ── Products ─────────────────────────────────────────────────────────────────

const allProducts = ref([]);
const orderItems  = ref([{ productId: null, product: null, quantity: 1, price: '' }]);

onMounted(async () => {
  const { data } = await getAllProducts();
  allProducts.value = (data || []).sort((a, b) => a.sku.localeCompare(b.sku));
});

const productLabel    = (p) => p ? `${p.sku} – ${p.display_name}` : '';
const productName     = (id) => allProducts.value.find(p => p.id === id)?.display_name ?? id;

const parsePrice = (v) => {
  if (v == null) return '';
  const n = Number(String(v).replace(',', '.'));
  return isNaN(n) ? '' : n;
};

const onProductSelect = (item, productId) => {
  const product = allProducts.value.find(p => p.id === productId) ?? null;
  item.product = product;
  item.price = product ? parsePrice(product.prices?.pln?.base_price) : '';
};

const addItem   = () => orderItems.value.push({ productId: null, product: null, quantity: 1, price: '' });
const removeItem = (i) => orderItems.value.splice(i, 1);

const warnShippingOutdated = () => {
  if (shippingMethods.value.length || editableParcels.value.length) {
    shippingMethods.value  = [];
    selectedShipping.value = null;
    editableParcels.value  = [];
    shippingError.value    = 'Produkty zostały zmienione — przelicz ceny wysyłki ponownie.';
  }
};

const toNum = (v) => { const n = Number(String(v).replace(',', '.')); return isNaN(n) ? 0 : n; };

const itemsTotal = computed(() =>
  orderItems.value.reduce((s, i) => s + toNum(i.quantity) * toNum(i.price), 0)
);

// ── Customer ──────────────────────────────────────────────────────────────────

const customer = reactive({
  email: '', phone: '', firstname: '', lastname: '',
  company: '', street: '', street_number: '', zip: '', city: '',
  country: 'PL', regulamin: true, privacy: true, marketing: false,
});

const countries = [{ code: 'PL', label: 'Polska' }, { code: 'DE', label: 'Niemcy' }, { code: 'CZ', label: 'Czechy' }];

// ── Payment ───────────────────────────────────────────────────────────────────

const paymentMethod = ref('bank_transfer');

// ── Shipping ──────────────────────────────────────────────────────────────────

// COD wynika z metody płatności — nie ma osobnego checkboxa
const cod = computed(() => paymentMethod.value === 'cod');

const shippingMethods     = ref([]);
const editableParcels     = ref([]);   // edytowalna lista paczek (auto + ręczne)
const shippingLoading     = ref(false);
const shippingError       = ref('');
const selectedShipping    = ref(null);
const customShippingLabel = ref('');
const customShippingPrice = ref('');

watch(
  () => orderItems.value.map(i => `${i.productId}:${i.quantity}`).join(','),
  warnShippingOutdated
);

watch(
  () => editableParcels.value.map(p => `${p.length}:${p.width}:${p.height}:${p.weight}`).join(','),
  () => {
    if (shippingMethods.value.length) {
      shippingMethods.value  = [];
      selectedShipping.value = null;
      shippingError.value    = 'Wymiary paczek zostały zmienione — przelicz ceny wysyłki ponownie.';
    }
  }
);

const canCalculateShipping = computed(() =>
  orderItems.value.length > 0 && orderItems.value.every(i => i.product && i.quantity > 0)
);

const newEmptyParcel = () => ({ length: '', width: '', height: '', weight: '' });

const addParcel    = () => editableParcels.value.push(newEmptyParcel());
const removeParcel = (i) => editableParcels.value.splice(i, 1);

// Pobiera paczki z algorytmu i uzupełnia editableParcels
const autoCalculateParcels = async () => {
  const items = orderItems.value.map(i => ({ product_id: i.product.id, quantity: Number(i.quantity) }));
  const parcels = await calculateParcelsForItems(items);
  editableParcels.value = parcels.map(p => ({
    cartoon_id:          p.cartoon_id ?? null,
    packaging_option_id: p.packaging_option_id ?? null,
    length: p.length,
    width:  p.width,
    height: p.height,
    weight: p.weight ?? p.max_weight,
    items:  p.items ?? [],
  }));
  return parcels.length > 0;
};

// Odpytuje Furgonetke z aktualną listą editableParcels
const fetchShippingPrices = async () => {
  shippingLoading.value  = true;
  shippingError.value    = '';
  shippingMethods.value  = [];
  selectedShipping.value = null;

  try {
    const { methods } = await $fetch('/api/shipping/calculate', {
      method: 'POST',
      body: {
        parcels: editableParcels.value,
        cod:     cod.value,
        service: ['dpd', 'inpost'],
        cart: {
          total_price:  itemsTotal.value,
          firstname:    customer.firstname,
          lastname:     customer.lastname,
          company:      customer.company,
          street:       customer.street,
          zip:          customer.zip,
          city:         customer.city,
          country:      customer.country || 'PL',
          email:        customer.email,
          phone:        customer.phone,
        },
      },
    });
    shippingMethods.value = methods;
    if (!methods.length) shippingError.value = 'Brak dostępnych metod wysyłki';
  } catch (e) {
    shippingError.value = e?.data?.statusMessage ?? e?.message ?? 'Błąd pobierania cen wysyłki';
  } finally {
    shippingLoading.value = false;
  }
};

// Główna akcja: auto-wylicz paczki → pobierz ceny
const calculateShipping = async () => {
  shippingError.value = '';
  const ok = await autoCalculateParcels();
  if (!ok) {
    shippingError.value = 'Nie można wyliczyć paczek — sprawdź reguły pakowania produktów';
    return;
  }
  await fetchShippingPrices();
};

// Zmiana płatności → wyczyść ceny wysyłki (trzeba przelicz ponownie)
watch(paymentMethod, () => {
  if (shippingMethods.value.length) {
    shippingMethods.value  = [];
    selectedShipping.value = null;
    shippingError.value    = 'Zmieniono metodę płatności — przelicz ceny wysyłki ponownie.';
  }
});

const CUSTOM_METHOD = { id: 'custom', service: 'custom', label: 'Inna (wpisz ręcznie)', price_gross: 0 };
const allShippingOptions = computed(() => [...shippingMethods.value, CUSTOM_METHOD]);

const shippingPrice = computed(() => {
  if (!selectedShipping.value) return 0;
  if (selectedShipping.value.id === 'custom') return toNum(customShippingPrice.value);
  return selectedShipping.value.price_gross ?? 0;
});

const shippingLabel = computed(() => {
  if (!selectedShipping.value) return '';
  if (selectedShipping.value.id === 'custom') return customShippingLabel.value;
  return selectedShipping.value.label;
});
const PAYMENT_METHODS = [
  { id: 'bank_transfer', label: 'Przelew bankowy',         description: 'na konto bankowe sprzedawcy' },
  { id: 'cod',           label: 'Płatność przy odbiorze',  description: 'Gotówka, karta, BLIK' },
];

// ── Status ────────────────────────────────────────────────────────────────────

const orderStatus   = ref('processing');
const paymentStatus = ref('pending');

const ORDER_STATUSES = [
  { value: 'awaiting_payment', label: 'Oczekuje na płatność' },
  { value: 'pending_approval', label: 'Do zatwierdzenia' },
  { value: 'processing',       label: 'W przygotowaniu' },
  { value: 'shipped',          label: 'Wysłane' },
  { value: 'completed',        label: 'Zrealizowane' },
  { value: 'cancelled',        label: 'Anulowane' },
  { value: 'partial_refund',   label: 'Częściowy zwrot' },
  { value: 'full_refund',      label: 'Całkowity zwrot' },
];

const PAYMENT_STATUSES = [
  { value: 'pending',                label: 'Oczekuje na płatność' },
  { value: 'paid',                   label: 'Opłacone' },
  { value: 'cod',                    label: 'Przy odbiorze' },
  { value: 'cancelled',              label: 'Anulowane' },
  { value: 'partial_refund_issued',  label: 'Zlecono częściowy zwrot kosztów' },
  { value: 'full_refund_issued',     label: 'Zlecono całkowity zwrot kosztów' },
];

// ── Summary ───────────────────────────────────────────────────────────────────

const orderTotal = computed(() => itemsTotal.value + shippingPrice.value);
const fmtMoney   = (v) => (Number(v) || 0).toFixed(2) + ' zł';

// ── Submit ────────────────────────────────────────────────────────────────────

const submitting = ref(false);
const errors     = ref([]);

const validate = () => {
  const e = [];
  if (!orderItems.value.length || orderItems.value.some(i => !i.product))
    e.push('Wybierz wszystkie produkty na liście');
  if (orderItems.value.some(i => !i.quantity || Number(i.quantity) < 1))
    e.push('Ilość każdego produktu musi być większa niż 0');
  if (!customer.phone) e.push('Podaj numer telefonu klienta');
  if (!customer.firstname || !customer.lastname) e.push('Podaj imię i nazwisko klienta');
  if (!selectedShipping.value) e.push('Wybierz metodę wysyłki');
  if (selectedShipping.value?.id === 'custom' && !customShippingLabel.value)
    e.push('Podaj nazwę niestandardowej metody wysyłki');
  return e;
};

const submit = async () => {
  errors.value = validate();
  if (errors.value.length) return;

  submitting.value = true;
  try {
    const payMeta = PAYMENT_METHODS.find(p => p.id === paymentMethod.value);
    const phone = customer.phone ? `+48${customer.phone.replace(/^\+48/, '')}` : '';
    const order = await addOrderManual({
      customer: { ...customer, phone },
      items: orderItems.value.map(i => ({
        product_id:     i.product.id,
        quantity:       Number(i.quantity),
        price_snapshot: Number(i.price),
      })),
      shipping: {
        cod:         cod.value,
        service:     selectedShipping.value.service,
        service_id:  selectedShipping.value.id,
        label:       shippingLabel.value,
        price_gross: shippingPrice.value,
        price_net:   shippingPrice.value,
      },
      payment: {
        service:     paymentMethod.value,
        label:       payMeta?.label ?? '',
        description: payMeta?.description ?? '',
      },
      status:         orderStatus.value,
      payment_status: paymentStatus.value,
      parcels:        editableParcels.value,
    });

    router.push(`/admin/order/view/${order.order_id}`);
  } catch (e) {
    errors.value = ['Błąd podczas tworzenia zamówienia: ' + (e.message ?? e)];
    console.error(e);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="add-order-page">
    <div class="page-header">
      <NuxtLink to="/admin/orders" class="back-link">
        <v-icon icon="mdi-arrow-left" size="18" />Wróć do zamówień
      </NuxtLink>
      <h1>Nowe zamówienie</h1>
    </div>

    <!-- Errors -->
    <div v-if="errors.length" class="error-box">
      <v-icon icon="mdi-alert-circle-outline" size="18" />
      <ul>
        <li v-for="e in errors" :key="e">{{ e }}</li>
      </ul>
    </div>

    <div class="layout">
      <!-- ── LEFT COLUMN ── -->
      <div class="main-col">

        <!-- SECTION: Produkty -->
        <section class="card">
          <h2 class="section-title">
            <v-icon icon="mdi-package-variant" size="20" />Produkty
          </h2>

          <div class="items-list">
            <div v-for="(item, idx) in orderItems" :key="idx" class="item-row">
              <v-autocomplete
                v-model="item.productId"
                :items="allProducts"
                :item-title="productLabel"
                item-value="id"
                label="Produkt"
                density="compact"
                variant="outlined"
                class="item-product"
                no-data-text="Brak wyników"
                @update:model-value="onProductSelect(item, $event)"
              >
                <template #item="{ props, item: p }">
                  <v-list-item v-bind="props">
                    <template #subtitle>{{ p.raw.sku }}</template>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <v-text-field
                v-model.number="item.quantity"
                label="Ilość"
                type="number"
                min="1"
                density="compact"
                variant="outlined"
                class="item-qty"
              />

              <v-text-field
                v-model="item.price"
                label="Cena (zł)"
                type="number"
                step="0.1"
                min="0"
                density="compact"
                variant="outlined"
                class="item-price"
              />

              <div class="item-total">
                {{ fmtMoney(Number(item.quantity || 0) * Number(item.price || 0)) }}
              </div>

              <button class="remove-btn" @click="removeItem(idx)" :disabled="orderItems.length === 1">
                <v-icon icon="mdi-close" size="18" />
              </button>
            </div>
          </div>

          <button class="btn-add-item" @click="addItem">
            <v-icon icon="mdi-plus" size="16" />Dodaj produkt
          </button>
        </section>

        <!-- SECTION: Dane klienta -->
        <section class="card">
          <h2 class="section-title">
            <v-icon icon="mdi-account-outline" size="20" />Dane klienta
          </h2>

          <div class="form-grid">
            <v-text-field v-model="customer.email"     label="E-mail"      type="email" density="compact" variant="outlined" class="span-2" />
            <v-text-field v-model="customer.firstname" label="Imię *"                   density="compact" variant="outlined" />
            <v-text-field v-model="customer.lastname"  label="Nazwisko *"               density="compact" variant="outlined" />
            <v-text-field v-model="customer.phone"     label="Telefon *"   type="tel"   density="compact" variant="outlined" />
            <v-text-field v-model="customer.company"    label="Firma"                     density="compact" variant="outlined" />
          </div>

          <div class="form-grid mt-4">
            <h3 class="form-subtitle span-2">Adres dostawy</h3>
            <v-text-field v-model="customer.street"        label="Ulica"        density="compact" variant="outlined" class="span-1-half" />
            <v-text-field v-model="customer.street_number" label="Nr budynku"   density="compact" variant="outlined" class="short" />
            <v-text-field v-model="customer.zip"           label="Kod pocztowy" density="compact" variant="outlined" class="short" />
            <v-text-field v-model="customer.city"          label="Miasto"       density="compact" variant="outlined" />
            <v-select
              v-model="customer.country"
              :items="countries"
              item-title="label"
              item-value="code"
              label="Kraj"
              density="compact"
              variant="outlined"
            />
          </div>
        </section>

        <!-- SECTION: Płatność -->
        <section class="card">
          <h2 class="section-title">
            <v-icon icon="mdi-credit-card-outline" size="20" />Płatność
          </h2>

          <div class="payment-options">
            <div
              v-for="method in PAYMENT_METHODS"
              :key="method.id"
              class="payment-option"
              :class="{ active: paymentMethod === method.id }"
              @click="paymentMethod = method.id"
            >
              <input type="radio" :value="method.id" v-model="paymentMethod" />
              <div class="payment-info">
                <strong>{{ method.label }}</strong>
                <span>{{ method.description }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION: Wysyłka -->
        <section class="card">
          <h2 class="section-title">
            <v-icon icon="mdi-truck-outline" size="20" />Wysyłka
          </h2>

          <button
            class="btn-calc-shipping"
            :disabled="!canCalculateShipping || shippingLoading"
            @click="calculateShipping"
          >
            <v-icon :icon="shippingLoading ? 'mdi-loading' : 'mdi-calculator-variant-outline'" size="18"
              :class="{ 'spin': shippingLoading }" />
            {{ shippingLoading ? 'Pobieranie cen...' : 'Pobierz ceny wysyłki z Furgonetki' }}
          </button>

          <p v-if="!canCalculateShipping" class="shipping-hint">
            Najpierw wybierz produkty i ich ilości.
          </p>

          <div v-if="shippingError" class="shipping-err">
            <v-icon icon="mdi-alert-circle-outline" size="16" />{{ shippingError }}
          </div>

          <!-- Edytowalne paczki -->
          <div v-if="editableParcels.length" class="parcels-summary">
            <div class="parcels-header">
              <v-icon icon="mdi-package-variant-closed" size="16" />
              <strong>{{ editableParcels.length }} {{ editableParcels.length === 1 ? 'paczka' : editableParcels.length < 5 ? 'paczki' : 'paczek' }}</strong>
              <span class="parcels-hint">— możesz edytować wymiary i wagę</span>
            </div>

            <div class="parcels-edit-list">
              <div v-for="(p, i) in editableParcels" :key="i" class="parcel-edit-row">
                <div class="parcel-dims-row">
                  <span class="parcel-num">#{{ i + 1 }}</span>
                  <input v-model="p.length" type="number" min="1" class="parcel-input" placeholder="Dł." title="Długość (cm)" />
                  <span class="parcel-sep">×</span>
                  <input v-model="p.width"  type="number" min="1" class="parcel-input" placeholder="Szer." title="Szerokość (cm)" />
                  <span class="parcel-sep">×</span>
                  <input v-model="p.height" type="number" min="1" class="parcel-input" placeholder="Wys." title="Wysokość (cm)" />
                  <span class="parcel-unit">cm</span>
                  <input v-model="p.weight" type="number" min="0.1" step="0.1" class="parcel-input parcel-weight-input" placeholder="Waga" title="Waga (kg)" />
                  <span class="parcel-unit">kg</span>
                  <button class="parcel-remove-btn" @click="removeParcel(i)" title="Usuń paczkę">
                    <v-icon icon="mdi-close" size="16" />
                  </button>
                </div>
                <div v-if="p.items?.length" class="parcel-contents">
                  <span v-for="it in p.items" :key="it.product_id" class="parcel-item-chip">
                    {{ productName(it.product_id) }} × {{ it.quantity }}
                  </span>
                </div>
              </div>
            </div>

            <div class="parcels-actions">
              <button class="btn-add-parcel" @click="addParcel">
                <v-icon icon="mdi-plus" size="15" />Dodaj paczkę ręcznie
              </button>
              <button class="btn-recalc" :disabled="shippingLoading" @click="fetchShippingPrices">
                <v-icon :icon="shippingLoading ? 'mdi-loading' : 'mdi-refresh'" size="15" :class="{ spin: shippingLoading }" />
                Przelicz ceny wysyłki
              </button>
            </div>
          </div>

          <!-- Opcja ręcznego dodania paczki gdy brak auto-obliczenia -->
          <div v-else-if="!shippingLoading" class="parcels-manual">
            <button class="btn-add-parcel" @click="addParcel">
              <v-icon icon="mdi-plus" size="15" />Dodaj paczkę ręcznie
            </button>
          </div>

          <!-- Metody wysyłki -->
          <div v-if="allShippingOptions.length > 1" class="shipping-options">
            <div
              v-for="method in allShippingOptions"
              :key="method.id"
              class="shipping-option"
              :class="{ active: selectedShipping?.id === method.id }"
              @click="selectedShipping = method"
            >
              <input type="radio" :value="method.id" :checked="selectedShipping?.id === method.id" readonly />
              <div class="shipping-info">
                <strong>{{ method.label }}</strong>
              </div>
              <div class="shipping-price" v-if="method.id !== 'custom'">
                {{ fmtMoney(method.price_gross) }}
              </div>
            </div>
          </div>

          <!-- Niestandardowa wysyłka -->
          <div v-if="selectedShipping?.id === 'custom'" class="custom-shipping">
            <v-text-field v-model="customShippingLabel" label="Nazwa metody wysyłki" density="compact" variant="outlined" />
            <v-text-field v-model="customShippingPrice" label="Cena wysyłki (zł)" type="number" step="0.01" min="0" density="compact" variant="outlined" />
          </div>
        </section>

        <!-- SECTION: Status -->
        <section class="card">
          <h2 class="section-title">
            <v-icon icon="mdi-tag-outline" size="20" />Status zamówienia
          </h2>
          <div class="form-grid">
            <v-select
              v-model="orderStatus"
              :items="ORDER_STATUSES"
              item-title="label"
              item-value="value"
              label="Status zamówienia"
              density="compact"
              variant="outlined"
            />
            <v-select
              v-model="paymentStatus"
              :items="PAYMENT_STATUSES"
              item-title="label"
              item-value="value"
              label="Status płatności"
              density="compact"
              variant="outlined"
            />
          </div>
        </section>

      </div>

      <!-- ── RIGHT COLUMN: Summary ── -->
      <aside class="summary-col">
        <div class="summary-card">
          <h2 class="section-title">
            <v-icon icon="mdi-receipt-outline" size="20" />Podsumowanie
          </h2>

          <div class="summary-lines">
            <template v-for="(item, idx) in orderItems" :key="idx">
              <div v-if="item.product" class="summary-line">
                <span class="summary-name">{{ item.product.display_name }}<br><small>{{ item.quantity }} × {{ fmtMoney(item.price) }}</small></span>
                <span class="summary-val">{{ fmtMoney(Number(item.quantity || 0) * Number(item.price || 0)) }}</span>
              </div>
            </template>
          </div>

          <div class="summary-divider" />

          <div class="summary-row">
            <span>Produkty</span>
            <span>{{ fmtMoney(itemsTotal) }}</span>
          </div>
          <div class="summary-row">
            <span>Wysyłka<template v-if="shippingLabel"> ({{ shippingLabel }})</template></span>
            <span>{{ fmtMoney(shippingPrice) }}</span>
          </div>

          <div class="summary-divider" />

          <div class="summary-row total">
            <span>Razem</span>
            <span>{{ fmtMoney(orderTotal) }}</span>
          </div>

          <div class="summary-meta">
            <div class="meta-row">
              <span>Status</span>
              <span>{{ ORDER_STATUSES.find(s => s.value === orderStatus)?.label }}</span>
            </div>
            <div class="meta-row">
              <span>Płatność</span>
              <span>{{ PAYMENT_STATUSES.find(s => s.value === paymentStatus)?.label }}</span>
            </div>
          </div>

          <button class="btn-submit" :disabled="submitting" @click="submit">
            <v-icon icon="mdi-check" size="18" />
            {{ submitting ? 'Tworzenie...' : 'Utwórz zamówienie' }}
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.add-order-page {
  padding: 28px 32px;
  max-width: 1400px;

  @media (max-width: 768px) { padding: 16px; }
}

.page-header {
  margin-bottom: 20px;

  h1 { font-size: 24px; font-weight: 700; color: #111; margin-top: 4px; }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 6px;
  &:hover { color: #111; }
}

.error-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ef4444;
  margin-bottom: 16px;
  font-size: 13px;

  ul { margin: 0; padding-left: 16px; }
}

// ── Layout ────────────────────────────────────────────────────────────────────
.layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.main-col { display: flex; flex-direction: column; gap: 16px; }

// ── Card ──────────────────────────────────────────────────────────────────────
.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #111;
  margin-bottom: 16px;
}

// ── Products ──────────────────────────────────────────────────────────────────
.items-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }

.item-row {
  display: grid;
  grid-template-columns: 1fr 80px 110px 90px 32px;
  gap: 8px;
  align-items: center;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 70px;
    .item-total, .item-price { display: none; }
  }
}

.item-product { grid-column: 1; }
.item-qty     { grid-column: 2; }
.item-price   { grid-column: 3; }

.item-total {
  font-size: 13px;
  font-weight: 600;
  text-align: right;
  color: #111;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;

  &:hover:not(:disabled) { background: #fee2e2; color: #ef4444; }
  &:disabled { opacity: 0.3; cursor: default; }
}

.btn-add-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  background: none;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;

  &:hover { background: #f9fafb; border-color: #9ca3af; color: #374151; }
}

// ── Customer form ─────────────────────────────────────────────────────────────
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 600px) { grid-template-columns: 1fr; }

  .span-2      { grid-column: span 2; @media (max-width: 600px) { grid-column: span 1; } }
  .span-1-half { grid-column: span 1; }
  .short       { grid-column: span 1; }
}

.form-subtitle {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: .04em;
  margin-bottom: 2px;
}

.mt-4 { margin-top: 8px; }

// ── Shipping ──────────────────────────────────────────────────────────────────
.btn-calc-shipping {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  color: #166534;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 14px;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: #dcfce7; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.shipping-hint { font-size: 12px; color: #9ca3af; margin-bottom: 12px; }

.shipping-err {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #ef4444;
  margin-bottom: 12px;
}

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

.parcels-summary {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 14px;
}

.parcels-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #374151;
  margin-bottom: 10px;
}

.parcels-hint { font-size: 11px; color: #9ca3af; }

.parcels-edit-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }

.parcel-edit-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.parcel-num {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  min-width: 28px;
}

.parcel-input {
  width: 60px;
  padding: 5px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: #32ab27; }
}

.parcel-weight-input { width: 68px; }
.parcel-sep  { font-size: 12px; color: #9ca3af; }
.parcel-unit { font-size: 11px; color: #9ca3af; margin-right: 6px; }

.parcel-dims-row {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.parcel-contents {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 5px;
  padding-left: 28px;
}

.parcel-item-chip {
  font-size: 11px;
  background: #e0f2e9;
  color: #166534;
  border-radius: 4px;
  padding: 2px 7px;
}

.parcel-remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 3px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-left: 2px;

  &:hover { background: #fee2e2; color: #ef4444; }
}

.parcels-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.parcels-manual { margin-bottom: 12px; }

.btn-add-parcel {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  background: none;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;

  &:hover { background: #f9fafb; border-color: #9ca3af; color: #374151; }
}

.btn-recalc {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid #86efac;
  border-radius: 6px;
  background: #f0fdf4;
  font-size: 12px;
  color: #166534;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: #dcfce7; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.shipping-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }

.shipping-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &.active { border-color: #32ab27; background: #f0fdf4; }
  &:hover:not(.active) { background: #f9fafb; }
}

.shipping-info {
  flex: 1;
  strong { font-size: 14px; }
}

.shipping-price { font-weight: 600; font-size: 14px; color: #111; }

.custom-shipping {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.cod-toggle { margin-top: 4px; }

.cod-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;

  input { width: 16px; height: 16px; cursor: pointer; accent-color: #32ab27; }
}

// ── Payment ───────────────────────────────────────────────────────────────────
.payment-options { display: flex; flex-direction: column; gap: 8px; }

.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &.active { border-color: #32ab27; background: #f0fdf4; }
  &.disabled { opacity: 0.4; cursor: not-allowed; }
  &:hover:not(.active):not(.disabled) { background: #f9fafb; }
}

.payment-info {
  flex: 1;
  strong { display: block; font-size: 14px; }
  span   { font-size: 12px; color: #6b7280; }
}

// ── Summary ───────────────────────────────────────────────────────────────────
.summary-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  position: sticky;
  top: 20px;
}

.summary-lines { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 13px;
  gap: 8px;

  .summary-name { flex: 1; color: #374151; small { color: #9ca3af; font-size: 11px; } }
  .summary-val  { font-weight: 500; white-space: nowrap; }
}

.summary-divider { border: none; border-top: 1px solid #f3f4f6; margin: 10px 0; }

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7280;
  padding: 3px 0;

  &.total {
    font-size: 16px;
    font-weight: 700;
    color: #111;
    padding: 6px 0;
  }
}

.summary-meta {
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px 12px;
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;

  :last-child { color: #374151; font-weight: 500; }
}

.btn-submit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #32ab27;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: #27891e; }
  &:disabled { opacity: 0.6; cursor: default; }
}
</style>
