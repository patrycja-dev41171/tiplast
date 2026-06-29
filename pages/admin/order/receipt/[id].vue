<script setup>
definePageMeta({ layout: false });

const route = useRoute();
const { getOrderById } = useOrder();

const order = ref(null);
const error = ref('');

onMounted(async () => {
  try {
    order.value = await getOrderById(route.params.id);
  } catch (e) {
    error.value = e.message;
  }
});

const print = () => window.print();

const saving = ref(false);
const savePdf = async () => {
  saving.value = true;
  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    const el = document.querySelector('.page');
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);

    const invoiceNum = (route.query.invoice_number ?? order.value?.order_number ?? 'faktura').replace(/\//g, '-');
    pdf.save(`faktura-${invoiceNum}.pdf`);
  } catch (e) {
    console.error(e);
  }
  saving.value = false;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (d) => d
  ? new Date(d).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
  : '—';

const fmtMoney = (n) => Number(n).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// Custom values from query params (editable in dialog)
const customItems = computed(() => {
  if (!route.query.items) return null;
  try { return JSON.parse(route.query.items); } catch { return null; }
});
const customShipping = computed(() => route.query.shipping !== undefined ? Number(route.query.shipping) : null);
const customNotes    = computed(() => route.query.notes ?? '');

const displayItems = computed(() => {
  if (customItems.value) return customItems.value;
  return (order.value?.order_items ?? []).map(i => ({
    name: i.product?.display_name ?? '—',
    qty: i.quantity,
    price: Number(i.price_snapshot),
  }));
});
const displayShipping = computed(() =>
  customShipping.value !== null ? customShipping.value : Number(order.value?.order_shipping_details?.price_gross ?? 0)
);

const productsTotal = computed(() =>
  displayItems.value.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.price) || 0), 0)
);
const shippingTotal = computed(() => displayShipping.value);
const grandTotal    = computed(() => productsTotal.value + shippingTotal.value);
const paymentLabel   = computed(() => order.value?.order_payment_details?.cod ? 'Za pobraniem' : 'Przelew bankowy');
const isTransfer     = computed(() => !order.value?.order_payment_details?.cod);

// ── Kwota słownie ─────────────────────────────────────────────────────────────
const ONES  = ['', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'];
const TEENS = ['dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście', 'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście'];
const TENS  = ['', 'dziesięć', 'dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt', 'dziewięćdziesiąt'];
const HUNDS = ['', 'sto', 'dwieście', 'trzysta', 'czterysta', 'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'];

const chunk = (n) => {
  const h = Math.floor(n / 100), rem = n % 100, t = Math.floor(rem / 10), o = rem % 10;
  const p = [];
  if (h) p.push(HUNDS[h]);
  if (t === 1) p.push(TEENS[o]);
  else { if (t) p.push(TENS[t]); if (o) p.push(ONES[o]); }
  return p.join(' ');
};

const amountInWords = computed(() => {
  const cents  = Math.round(grandTotal.value * 100);
  const zlote  = Math.floor(cents / 100);
  const grosze = cents % 100;
  const th = Math.floor(zlote / 1000), rem = zlote % 1000;
  const parts = [];
  if (th) {
    const t = chunk(th);
    if (t) parts.push(t);
    const o = th % 10, tens = Math.floor(th / 10) % 10;
    parts.push(th === 1 ? 'tysiąc' : (tens !== 1 && o >= 2 && o <= 4) ? 'tysiące' : 'tysięcy');
  }
  if (rem) parts.push(chunk(rem));
  const o = zlote % 10, tens = Math.floor(zlote / 10) % 10;
  const zlForm = zlote === 1 ? 'złoty' : (tens !== 1 && o >= 2 && o <= 4) ? 'złote' : 'złotych';
  parts.push(zlForm);
  return parts.filter(Boolean).join(' ') + ` ${String(grosze).padStart(2, '0')}/100`;
});
</script>

<template>
  <div v-if="error" style="padding:40px;color:red;font-family:sans-serif">Błąd: {{ error }}</div>
  <div v-else-if="!order" style="padding:40px;color:#999;font-family:sans-serif">Ładowanie...</div>

  <div v-else>
    <div class="print-bar no-print">
      <button class="print-btn" @click="print">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Drukuj
      </button>
      <button class="print-btn print-btn--save" @click="savePdf" :disabled="saving">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        {{ saving ? 'Generowanie...' : 'Zapisz jako PDF' }}
      </button>
    </div>

  <div class="page">

    <!-- ── TOP ──────────────────────────────────────────────────────────────── -->
    <div class="top">
      <img src="/images/logo_green.svg" alt="tiplast" class="logo" />
      <div class="doc-meta-right">
        <div class="doc-place-date">Papowo Biskupie, {{ fmt(order.created_at) }}</div>
        <div class="doc-title">
          {{ route.query.type === 'credit_memo' ? 'FAKTURA KORYGUJĄCA' : 'FAKTURA' }}
          nr {{ route.query.invoice_number ?? order.order_number }}
        </div>
        <div v-if="route.query.type === 'credit_memo' && route.query.original" class="doc-subtitle">
          Korekta do faktury nr {{ route.query.original }}
        </div>
      </div>
    </div>

    <!-- ── STRONY ────────────────────────────────────────────────────────────── -->
    <div class="parties">
      <div class="party">
        <div class="party-heading">SPRZEDAWCA</div>
        <div class="party-name">TIPLAST Tomasz Iński</div>
        <div class="party-line">Papowo Biskupie 31</div>
        <div class="party-line">86-221 Papowo Biskupie</div>
        <div class="party-line">Polska</div>
        <div class="party-meta">
          <strong>REGON</strong> 361058296
        </div>
      </div>

      <div class="party">
        <div class="party-heading">NABYWCA</div>
        <div class="party-name">
          <template v-if="order.company">{{ order.company }}</template>
          <template v-else>{{ order.firstname }} {{ order.lastname }}</template>
        </div>
        <div class="party-line">{{ order.street }}<template v-if="order.street_number"> {{ order.street_number }}</template></div>
        <div class="party-line">{{ order.zip }} {{ order.city }}</div>
        <div class="party-line">Polska</div>
      </div>
    </div>

    <div class="vat-note">
      SPRZEDAWCA ZWOLNIONY PODMIOTOWO Z PODATKU OD TOWARÓW I USŁUG —
      <span class="vat-note-small">[dostawa towarów lub świadczenie usług zwolnione na podstawie art. 113 ust. 1 albo ust. 9 ustawy z dnia 11 marca 2004 r. o podatku od towarów i usług (Dz.U. z 2016 r., poz. 710, z późn. zm.)]</span>
    </div>

    <!-- ── DATA WYSTAWIENIA ──────────────────────────────────────────────────── -->
    <div class="issue-bar">
      <span class="issue-bar__label">Data wystawienia:</span>
      <span class="issue-bar__val">{{ fmt(order.created_at) }}</span>
    </div>

    <!-- ── TABELA PRODUKTÓW ─────────────────────────────────────────────────── -->
    <table class="items">
      <thead>
        <tr>
          <th class="th-qty">Ilość</th>
          <th class="th-name">Nazwa Usługi / Towaru</th>
          <th class="th-price">Cena netto</th>
          <th class="th-total">Razem</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in displayItems" :key="i">
          <td class="td-qty">{{ item.qty }} szt.</td>
          <td>{{ item.name }}</td>
          <td class="td-price">{{ fmtMoney(item.price) }}</td>
          <td class="td-total">{{ fmtMoney((Number(item.qty)||0) * (Number(item.price)||0)) }}</td>
        </tr>
        <tr v-if="shippingTotal > 0">
          <td class="td-qty">1 usł.</td>
          <td>Dostawa{{ !customItems ? ` (${order.order_shipping_details?.service ?? 'wysyłka'})` : '' }}</td>
          <td class="td-price">{{ fmtMoney(shippingTotal) }}</td>
          <td class="td-total">{{ fmtMoney(shippingTotal) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- ── STOPKA ────────────────────────────────────────────────────────────── -->
    <div class="footer-row">
      <div class="stamp-area">
        <div class="stamp-label">Pieczątka i podpis</div>
        <div class="stamp-box"></div>
      </div>

      <div class="total-block">
        <div class="total-bar">
          <span class="total-bar__label">Razem do zapłaty</span>
          <span class="total-bar__val">{{ fmtMoney(grandTotal) }} zł</span>
        </div>
      </div>
    </div>

    <!-- Uwaga -->
    <div class="note-area">
      <div class="note-label">Adnotacje / Uwagi</div>
      <div v-if="customNotes" class="note-text">{{ customNotes }}</div>
      <template v-else>
        <div class="note-line"></div>
        <div class="note-line"></div>
        <div class="note-line"></div>
      </template>
    </div>


  </div>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  color: #1a1a1a;
  background: #f0f0f0;
}

.no-print { display: block; }

@media print {
  .no-print { display: none !important; }
  html, body { background: #fff; }
  @page { margin: 14mm 14mm 14mm 14mm; size: A4; }
  /* Wymuś drukowanie kolorów tła */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}
</style>

<style scoped>
/* ── Pasek przycisków ────────────────────────────────────────────────────────── */
.print-bar {
  max-width: 210mm;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 4px 0;
}

.print-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: #1a1a2e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-family: sans-serif;
  cursor: pointer;
  &:hover { background: #16213e; }

  &--save {
    background: #32aa27;
    &:hover { background: #279620; }
  }
}

.print-hint {
  font-family: sans-serif;
  font-size: 11px;
  color: #aaa;
  margin-left: 4px;
}

/* ── Strona ──────────────────────────────────────────────────────────────────── */
.page {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  margin: 24px auto;
  padding: 20mm 18mm 16mm;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,.12);
}

@media print {
  .page {
    margin: 0;
    padding: 0;
    box-shadow: none;
    width: 100%;
    min-height: unset;
  }
}

/* ── Top ─────────────────────────────────────────────────────────────────────── */
.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.logo {
  height: 52px;
  width: auto;
}

.doc-meta-right { text-align: right; }

.doc-subtitle {
  font-size: 12px;
  color: #b45309;
  text-align: right;
  margin-top: 4px;
}

.doc-place-date {
  font-size: 11.5px;
  color: #555;
  text-align: right;
  margin-top: 6px;
}

.doc-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: right;
  letter-spacing: -.3px;
}

/* ── Strony ──────────────────────────────────────────────────────────────────── */
.parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.party-heading {
  font-size: 15px;
  font-weight: 700;
  color: #32aa27;
  margin-bottom: 8px;
}
.party-name { font-weight: 700; font-size: 13px; margin-bottom: 4px; }
.party-line { font-size: 12px; color: #333; line-height: 1.7; }
.party-meta { font-size: 11.5px; margin-top: 8px; color: #333; }
.vat-note {
  font-size: 9.5px;
  font-weight: 600;
  color: #444;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  padding: 7px 0;
  line-height: 1.5;
}
.vat-note-small { font-weight: 400; color: #666; }
.party-contact-heading { font-size: 11.5px; font-weight: 600; color: #32aa27; margin-top: 12px; margin-bottom: 3px; }

/* ── Data wystawienia ────────────────────────────────────────────────────────── */
.issue-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #444;
}
.issue-bar__label { font-weight: 600; }
.issue-bar__val   { }

/* ── Tabela ──────────────────────────────────────────────────────────────────── */
.items {
  width: 100%;
  border-collapse: collapse;
  margin-top: 4px;
}

.items thead tr {
  border-bottom: 2px solid #1a1a1a;
}
.items thead th {
  font-size: 11.5px;
  font-weight: 700;
  color: #1a1a1a;
  padding: 10px 10px;
  text-align: left;
  white-space: nowrap;
}
.items tbody td {
  font-size: 12px;
  padding: 10px 10px;
  border-bottom: 1px solid #e8e8e8;
  color: #222;
  vertical-align: middle;
}
.items tbody tr:last-child td { border-bottom: 2px solid #1a1a1a; }

.th-qty   { width: 80px; }
.th-name  { width: auto; }
.th-price { width: 130px; text-align: right; padding-right: 14px !important; }
.th-total { width: 120px; text-align: right; padding-right: 14px !important; }
.td-qty   { color: #555; }
.td-price { text-align: right; padding-right: 14px !important; }
.td-total { text-align: right; font-weight: 600; padding-right: 14px !important; }

/* ── Stopka ──────────────────────────────────────────────────────────────────── */
.footer-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-top: 8px;
}

.stamp-area { flex: 0 0 260px; }
.stamp-label { font-size: 11px; font-weight: 600; color: #32aa27; margin-bottom: 8px; }
.stamp-box {
  width: 240px;
  height: 110px;
  border: 1.5px dashed #ccc;
  border-radius: 4px;
}

.total-block {
  flex: 1;
  max-width: 380px;
}

.total-words {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 10px;
}
.total-words__label { font-size: 10px; color: #888; }
.total-words__val   { font-size: 11.5px; color: #333; font-style: italic; }

.total-bar {
  background: #32aa27;
  color: #fff;
  border-radius: 4px;
  padding: 13px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total-bar__label { font-size: 16px; font-weight: 700; }
.total-bar__val   { font-size: 22px; font-weight: 800; letter-spacing: -.5px; }

/* ── Uwaga ───────────────────────────────────────────────────────────────────── */
.note-area  { margin-top: 16px; }
.note-label { font-size: 11px; color: #333; margin-bottom: 14px; }
.note-line  { border-bottom: 1px solid #d0d0d0; margin-bottom: 20px; }
.note-text  { font-size: 12px; color: #333; line-height: 1.7; white-space: pre-wrap; }

/* ── Page footer ─────────────────────────────────────────────────────────────── */
.page-footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: #888;
}
</style>
