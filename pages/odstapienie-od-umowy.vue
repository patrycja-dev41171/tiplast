<script setup>
const { $supabase } = useNuxtApp();

// ── Form state ────────────────────────────────────────────────────────────────

const form = reactive({
  firstname:       '',
  lastname:        '',
  order_number:    '',
  email:           '',
  phone:           '',
  withdrawal_type: 'full',   // 'full' | 'partial'
  selected_items:  [],       // [{product_id, name, quantity}] dla partial
  reason:          '',
  bank_account:    '',
  account_holder:  '',
  regulamin:       false,
});

// ── Order lookup ──────────────────────────────────────────────────────────────

const order       = ref(null);
const orderItems  = ref([]);
const lookupError = ref('');
const lookupLoading = ref(false);

const canLookup = computed(() =>
  form.order_number.trim().length > 0 && form.email.trim().length > 0
);

const lookupOrder = async () => {
  if (!canLookup.value) return;
  lookupLoading.value = true;
  lookupError.value   = '';
  order.value         = null;
  orderItems.value    = [];
  form.selected_items = [];

  const { data, error } = await $supabase
    .from('orders')
    .select(`
      order_id, order_number, email,
      order_items (
        id, quantity, price_snapshot,
        products ( id, display_name, sku )
      )
    `)
    .eq('order_number', form.order_number.trim())
    .eq('email', form.email.trim().toLowerCase())
    .maybeSingle();

  lookupLoading.value = false;

  if (error || !data) {
    lookupError.value = 'Nie znaleziono zamówienia o podanym numerze i adresie e-mail. Sprawdź poprawność danych.';
    return;
  }

  order.value      = data;
  orderItems.value = (data.order_items || []).map(i => ({
    id:         i.id,
    product_id: i.products?.id,
    name:       i.products?.display_name ?? i.products?.sku ?? '—',
    sku:        i.products?.sku ?? '',
    quantity:   i.quantity,
    price:      i.price_snapshot,
    selected:   false,
    return_qty: i.quantity,
  }));
};

// Gdy zmienia się typ odstąpienia, czyść wybrane produkty
watch(() => form.withdrawal_type, () => {
  form.selected_items = [];
  orderItems.value.forEach(i => { i.selected = false; i.return_qty = i.quantity; });
});

const selectedCount = computed(() => orderItems.value.filter(i => i.selected).length);

// ── Errors & submit ───────────────────────────────────────────────────────────

const errors    = ref([]);
const submitted = ref(false);
const submitting = ref(false);
const withdrawalNumber = ref('');

const validate = () => {
  const e = [];
  if (!form.firstname.trim()) e.push('Podaj imię.');
  if (!form.lastname.trim())  e.push('Podaj nazwisko.');
  if (!form.email.trim())     e.push('Podaj adres e-mail.');
  if (!form.phone.trim())     e.push('Podaj numer telefonu.');
  if (!order.value)           e.push('Wyszukaj zamówienie na podstawie numeru i e-maila.');
  if (form.withdrawal_type === 'partial' && selectedCount.value === 0)
    e.push('Zaznacz przynajmniej jeden produkt do zwrotu.');
  if (!form.bank_account.trim()) e.push('Podaj numer rachunku bankowego.');
  if (!form.account_holder.trim()) e.push('Podaj imię i nazwisko właściciela rachunku.');
  if (!form.regulamin) e.push('Zaakceptuj warunki odstąpienia od umowy.');
  return e;
};

const submit = async () => {
  errors.value = validate();
  if (errors.value.length) return;

  submitting.value = true;

  const items = form.withdrawal_type === 'full'
    ? orderItems.value.map(i => ({ name: i.name, sku: i.sku, quantity: i.quantity }))
    : orderItems.value
        .filter(i => i.selected)
        .map(i => ({ name: i.name, sku: i.sku, quantity: Number(i.return_qty) }));

  try {
    const res = await $fetch('/api/withdrawal/submit', {
      method: 'POST',
      body: {
        order_id:        order.value.order_id,
        order_number:    order.value.order_number,
        firstname:       form.firstname,
        lastname:        form.lastname,
        email:           form.email,
        phone:           form.phone,
        withdrawal_type: form.withdrawal_type,
        items,
        reason:          form.reason || null,
        bank_account:    form.bank_account,
        account_holder:  form.account_holder,
      },
    });
    withdrawalNumber.value = res.withdrawal_number;
    submitted.value = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    errors.value = ['Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie lub skontaktuj się z nami mailowo.'];
    console.error(e);
  } finally {
    submitting.value = false;
  }
};

const fmtMoney = (v) => (Number(v) || 0).toFixed(2) + ' zł';
</script>

<template>
  <section class="page">
    <div class="page-inner">
      <h1>Formularz odstąpienia od umowy</h1>
      <p class="intro">
        Wypełnij formularz, aby złożyć oświadczenie o odstąpieniu od umowy.
        Po jego otrzymaniu prześlemy Ci potwierdzenie na podany adres e-mail
        wraz z dalszą instrukcją zwrotu.
      </p>

      <!-- ── Sukces ── -->
      <div v-if="submitted" class="success-box">
        <v-icon icon="mdi-check-circle-outline" size="40" color="#32aa27" />
        <div>
          <h2>Formularz wysłany</h2>
          <div class="withdrawal-number">
            Numer zwrotu: <strong>{{ withdrawalNumber }}</strong>
          </div>
          <p>
            Otrzymaliśmy Twoje oświadczenie o odstąpieniu od umowy dotyczące zamówienia
            <strong>{{ order?.order_number }}</strong>.<br />
            Potwierdzenie zostało wysłane na adres <strong>{{ form.email }}</strong>.<br />
            Skontaktujemy się z Tobą w celu potwierdzenia i przekazania instrukcji zwrotu.
          </p>
          <p class="success-note">Prosimy nie odsyłać towaru przed otrzymaniem potwierdzenia od nas.</p>
          <NuxtLink to="/" class="btn-back">Wróć na stronę główną</NuxtLink>
        </div>
      </div>

      <form v-else @submit.prevent="submit">

        <!-- ── Błędy ── -->
        <div v-if="errors.length" class="error-box">
          <v-icon icon="mdi-alert-circle-outline" size="18" />
          <ul>
            <li v-for="e in errors" :key="e">{{ e }}</li>
          </ul>
        </div>

        <!-- ── Dane osobowe ── -->
        <div class="card">
          <h2 class="card-title">Dane osobowe</h2>
          <div class="grid-2">
            <div class="field">
              <label>Imię *</label>
              <input v-model="form.firstname" type="text" placeholder="Jan" />
            </div>
            <div class="field">
              <label>Nazwisko *</label>
              <input v-model="form.lastname" type="text" placeholder="Kowalski" />
            </div>
            <div class="field">
              <label>Adres e-mail *</label>
              <input v-model="form.email" type="email" placeholder="jan@example.com" />
            </div>
            <div class="field">
              <label>Numer telefonu *</label>
              <input v-model="form.phone" type="tel" placeholder="600 000 000" />
            </div>
          </div>
        </div>

        <!-- ── Wyszukiwanie zamówienia ── -->
        <div class="card">
          <h2 class="card-title">Numer zamówienia</h2>
          <div class="grid-2">
            <div class="field">
              <label>Numer zamówienia *</label>
              <input v-model="form.order_number" type="text" placeholder="np. ORD-2024-001" />
            </div>
          </div>
          <button
            type="button"
            class="btn-lookup"
            :disabled="!canLookup || lookupLoading"
            @click="lookupOrder"
          >
            <v-icon :icon="lookupLoading ? 'mdi-loading' : 'mdi-magnify'" size="18"
              :class="{ spin: lookupLoading }" />
            {{ lookupLoading ? 'Szukam...' : 'Wyszukaj zamówienie' }}
          </button>

          <div v-if="lookupError" class="field-error mt-8">
            <v-icon icon="mdi-alert-circle-outline" size="16" /> {{ lookupError }}
          </div>

          <div v-if="order" class="order-found">
            <v-icon icon="mdi-check-circle-outline" size="18" color="#32aa27" />
            Znaleziono zamówienie <strong>{{ order.order_number }}</strong>
            ({{ orderItems.length }} {{ orderItems.length === 1 ? 'produkt' : 'produkty' }})
          </div>
        </div>

        <!-- ── Typ odstąpienia ── -->
        <div v-if="order" class="card">
          <h2 class="card-title">Zakres odstąpienia</h2>

          <div class="radio-group">
            <label class="radio-option" :class="{ active: form.withdrawal_type === 'full' }">
              <input v-model="form.withdrawal_type" type="radio" value="full" />
              <div>
                <strong>Odstępuję od całości umowy</strong>
                <span>Zwracam wszystkie produkty z zamówienia</span>
              </div>
            </label>
            <label class="radio-option" :class="{ active: form.withdrawal_type === 'partial' }">
              <input v-model="form.withdrawal_type" type="radio" value="partial" />
              <div>
                <strong>Odstępuję od części umowy</strong>
                <span>Wybieram, które produkty zwracam</span>
              </div>
            </label>
          </div>

          <!-- Lista produktów do wyboru (tylko przy partial) -->
          <div v-if="form.withdrawal_type === 'partial'" class="items-list">
            <p class="items-hint">Zaznacz produkty, które chcesz zwrócić:</p>
            <label
              v-for="item in orderItems"
              :key="item.id"
              class="item-row"
              :class="{ checked: item.selected }"
            >
              <input v-model="item.selected" type="checkbox" />
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-meta">{{ item.sku }} · {{ item.quantity }} szt. · {{ fmtMoney(item.price) }}/szt.</span>
              </div>
              <div v-if="item.selected" class="item-qty">
                <label class="qty-label">Ilość do zwrotu:</label>
                <input
                  v-model.number="item.return_qty"
                  type="number"
                  :min="1"
                  :max="item.quantity"
                  class="qty-input"
                />
              </div>
            </label>
          </div>

          <!-- Podgląd przy full -->
          <div v-else class="items-preview">
            <div v-for="item in orderItems" :key="item.id" class="preview-row">
              <span>{{ item.name }}</span>
              <span class="preview-qty">{{ item.quantity }} szt.</span>
            </div>
          </div>
        </div>

        <!-- ── Powód (opcjonalny) ── -->
        <div v-if="order" class="card">
          <h2 class="card-title">Powód zwrotu <span class="optional">(opcjonalnie)</span></h2>
          <div class="field">
            <textarea v-model="form.reason" rows="3" placeholder="Opisz powód odstąpienia od umowy..." />
          </div>
        </div>

        <!-- ── Dane do zwrotu ── -->
        <div v-if="order" class="card">
          <h2 class="card-title">Dane do zwrotu płatności</h2>
          <div class="grid-2">
            <div class="field span-2">
              <label>Numer rachunku bankowego *</label>
              <input v-model="form.bank_account" type="text" placeholder="PL00 0000 0000 0000 0000 0000 0000" />
            </div>
            <div class="field span-2">
              <label>Imię i nazwisko właściciela rachunku *</label>
              <input v-model="form.account_holder" type="text" placeholder="Jan Kowalski" />
            </div>
          </div>
        </div>

        <!-- ── Regulamin ── -->
        <div v-if="order" class="card">
          <label class="checkbox-row">
            <input v-model="form.regulamin" type="checkbox" />
            <span>
              Oświadczam, że zapoznałem/am się z warunkami odstąpienia od umowy określonymi w
              <NuxtLink to="/zwroty-i-odstapienie-od-umowy">Polityce zwrotów</NuxtLink>
              i przyjmuję je do wiadomości. *
            </span>
          </label>
        </div>

        <!-- ── Submit ── -->
        <button v-if="order" type="submit" class="btn-submit" :disabled="submitting">
          <v-icon icon="mdi-send-outline" size="18" />
          {{ submitting ? 'Wysyłanie...' : 'Wyślij oświadczenie o odstąpieniu od umowy' }}
        </button>

      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.page {
  background: #f9fafb;
  min-height: 100vh;
  padding: 40px 24px 80px;
}

.page-inner {
  max-width: 720px;
  margin: 0 auto;
}

h1 {
  font-size: 26px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
}

.intro {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 28px;
}

// ── Card ──────────────────────────────────────────────────────────────────────
.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  margin-bottom: 16px;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin-bottom: 16px;
}

.optional {
  font-size: 12px;
  font-weight: 400;
  color: #9ca3af;
}

// ── Grid ──────────────────────────────────────────────────────────────────────
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 560px) { grid-template-columns: 1fr; }
}

.span-2 { grid-column: span 2; @media (max-width: 560px) { grid-column: span 1; } }

// ── Field ─────────────────────────────────────────────────────────────────────
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }

  input, textarea {
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #111;
    outline: none;
    transition: border-color 0.15s;
    font-family: inherit;
    resize: vertical;

    &:focus { border-color: #32aa27; }
    &::placeholder { color: #9ca3af; }
  }
}

.mt-8 { margin-top: 8px; }

// ── Order lookup ──────────────────────────────────────────────────────────────
.btn-lookup {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 18px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  color: #166534;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: #dcfce7; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.field-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #ef4444;
  margin-top: 10px;
}

.order-found {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #166534;
  margin-top: 10px;
}

// ── Radio ─────────────────────────────────────────────────────────────────────
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &.active { border-color: #32aa27; background: #f0fdf4; }
  &:hover:not(.active) { background: #f9fafb; }

  input { margin-top: 3px; accent-color: #32aa27; flex-shrink: 0; }

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong { font-size: 14px; color: #111; }
    span   { font-size: 12px; color: #6b7280; }
  }
}

// ── Items list ────────────────────────────────────────────────────────────────
.items-hint {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 10px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  flex-wrap: wrap;

  &.checked { border-color: #32aa27; background: #f0fdf4; }
  &:hover:not(.checked) { background: #f9fafb; }

  input[type="checkbox"] { accent-color: #32aa27; flex-shrink: 0; width: 16px; height: 16px; }
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name { font-size: 14px; font-weight: 500; color: #111; }
.item-meta { font-size: 11px; color: #9ca3af; }

.item-qty {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-label { font-size: 12px; color: #6b7280; white-space: nowrap; }

.qty-input {
  width: 64px;
  padding: 5px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
  outline: none;
  &:focus { border-color: #32aa27; }
}

// ── Items preview (full) ──────────────────────────────────────────────────────
.items-preview {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  font-size: 13px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;

  &:last-child { border-bottom: none; }
}

.preview-qty { color: #6b7280; font-weight: 500; }

// ── Checkbox ──────────────────────────────────────────────────────────────────
.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  line-height: 1.5;

  input { accent-color: #32aa27; width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }
  a { color: #32aa27; }
}

// ── Error box ─────────────────────────────────────────────────────────────────
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

// ── Submit ────────────────────────────────────────────────────────────────────
.btn-submit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: #32aa27;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 8px;

  &:hover:not(:disabled) { background: #27891e; }
  &:disabled { opacity: 0.6; cursor: default; }
}

// ── Success ───────────────────────────────────────────────────────────────────
.success-box {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 12px;
  padding: 28px;
  margin-top: 16px;

  h2 { font-size: 20px; color: #166534; margin-bottom: 8px; }
  p  { font-size: 14px; color: #374151; line-height: 1.6; }
}

.withdrawal-number {
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid #32aa27;
  border-radius: 8px;
  padding: 8px 16px;
  margin-bottom: 12px;
  color: #166534;

  strong { font-size: 20px; }
}

.success-note {
  font-size: 13px;
  font-weight: 600;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 10px 0;
}

.btn-back {
  display: inline-block;
  margin-top: 16px;
  padding: 10px 20px;
  background: #32aa27;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s;

  &:hover { background: #27891e; }
}

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }
</style>
