<template>
    <div v-if="order" class="order-view">

        <!-- ── Nagłówek ────────────────────────────────────────────────────────── -->
        <div class="page-header">
            <AdminPageHeader :text="`Zamówienie ${order.order_number}`" />
            <div class="header-actions">
                <button class="action-btn" @click="showChangeStatus = true">
                    <v-icon icon="mdi-swap-horizontal" size="16" />Zmień status
                </button>
                <button class="action-btn" @click="showChangePaymentStatus = true">
                    <v-icon icon="mdi-credit-card-outline" size="16" />Zmień płatność
                </button>
                <button v-if="order.status === 'processing'" class="action-btn" @click="addToFurgonetka">
                    <v-icon icon="mdi-truck-delivery-outline" size="16" />Furgonetka
                </button>
                <button class="action-btn action-btn--invoice" @click="openDialog('invoice')">
                    <v-icon icon="mdi-file-document-outline" size="16" />
                    {{ order.invoice_number ? 'Podgląd faktury' : 'Wystaw fakturę' }}
                </button>
                <button v-if="order.invoice_number" class="action-btn action-btn--credit" @click="openDialog('credit_memo')">
                    <v-icon icon="mdi-file-document-edit-outline" size="16" />
                    {{ order.credit_memo_number ? 'Podgląd korekty' : 'Wystaw korektę' }}
                </button>
            </div>
        </div>

        <!-- ── Status bar ──────────────────────────────────────────────────────── -->
        <div class="status-bar">
            <div class="status-bar__item">
                <span class="status-bar__label">Status zamówienia</span>
                <span class="status-chip" :style="{ color: getOrderStatusMeta(order.status).color, background: hexAlpha(getOrderStatusMeta(order.status).color, 0.1), borderColor: hexAlpha(getOrderStatusMeta(order.status).color, 0.3) }">
                    {{ getOrderStatusMeta(order.status).label }}
                </span>
            </div>
            <div class="status-bar__sep" />
            <div class="status-bar__item">
                <span class="status-bar__label">Płatność</span>
                <span class="status-chip" :style="{ color: getPaymentStatusMeta(order.payment_status).color, background: hexAlpha(getPaymentStatusMeta(order.payment_status).color, 0.1), borderColor: hexAlpha(getPaymentStatusMeta(order.payment_status).color, 0.3) }">
                    {{ getPaymentStatusMeta(order.payment_status).label }}
                </span>
            </div>
            <template v-if="order.invoice_number">
                <div class="status-bar__sep" />
                <div class="status-bar__item">
                    <span class="status-bar__label">Faktura</span>
                    <span class="invoice-chip" @click="openDialog('invoice')">
                        <v-icon icon="mdi-file-check-outline" size="13" />
                        {{ order.invoice_number }}
                    </span>
                </div>
            </template>
            <template v-if="order.credit_memo_number">
                <div class="status-bar__sep" />
                <div class="status-bar__item">
                    <span class="status-bar__label">Korekta</span>
                    <span class="invoice-chip invoice-chip--credit" @click="openDialog('credit_memo')">
                        <v-icon icon="mdi-file-edit-outline" size="13" />
                        {{ order.credit_memo_number }}
                    </span>
                </div>
            </template>
        </div>

        <!-- ── Info grid ───────────────────────────────────────────────────────── -->
        <div class="info-grid">
            <div class="info-card">
                <div class="info-row">
                    <v-icon icon="mdi-pound" size="16" color="#9ca3af" />
                    <span class="info-label">Numer zamówienia</span>
                    <span class="info-val">{{ order.order_number }}</span>
                </div>
                <div class="info-row">
                    <v-icon icon="mdi-calendar-outline" size="16" color="#9ca3af" />
                    <span class="info-label">Data zamówienia</span>
                    <span class="info-val">{{ formatDate(order.created_at) }}</span>
                </div>
                <div class="info-row">
                    <v-icon icon="mdi-account-outline" size="16" color="#9ca3af" />
                    <span class="info-label">Klient</span>
                    <span class="info-val">{{ order.firstname }} {{ order.lastname }}</span>
                </div>
                <div class="info-row">
                    <v-icon icon="mdi-email-outline" size="16" color="#9ca3af" />
                    <span class="info-label">Email</span>
                    <span class="info-val">{{ order.email }}</span>
                </div>
                <div class="info-row">
                    <v-icon icon="mdi-phone-outline" size="16" color="#9ca3af" />
                    <span class="info-label">Telefon</span>
                    <span class="info-val">{{ order.phone || '—' }}</span>
                </div>
            </div>

            <div class="info-card">
                <div class="info-row">
                    <v-icon icon="mdi-cash-multiple" size="16" color="#9ca3af" />
                    <span class="info-label">Wartość zamówienia</span>
                    <span class="info-val info-val--bold">{{ grandTotal.toFixed(2) }} zł</span>
                </div>
                <div class="info-row">
                    <v-icon icon="mdi-cash" size="16" color="#9ca3af" />
                    <span class="info-label">Wartość produktów</span>
                    <span class="info-val">{{ calculateProductsTotal(order).toFixed(2) }} zł</span>
                </div>
                <div class="info-row">
                    <v-icon icon="mdi-truck-outline" size="16" color="#9ca3af" />
                    <span class="info-label">Koszt wysyłki</span>
                    <span class="info-val">{{ Number(order.order_shipping_details?.price_gross ?? 0).toFixed(2) }} zł</span>
                </div>
                <div v-if="order.source" class="info-row">
                    <v-icon icon="mdi-source-branch" size="16" color="#9ca3af" />
                    <span class="info-label">Źródło</span>
                    <span class="info-val">{{ order.source === 'manual' ? 'Manualne' : 'Strona' }}</span>
                </div>
            </div>
        </div>

        <!-- ── Zakładki ────────────────────────────────────────────────────────── -->
        <div class="tabs">
            <button v-for="t in tabs" :key="t.id" class="tab" :class="{ active: tab === t.id }" @click="tab = t.id">
                <v-icon :icon="t.icon" size="18" />{{ t.label }}
            </button>
        </div>

        <OrderProducts v-if="tab === 'products'" :order="order" />
        <OrderPayment v-if="tab === 'payment_details'" :order="order" />
        <OrderShipping v-if="tab === 'shipping_details'" :order="order" />
        <OrderPacking v-if="tab === 'packing'" :order="order" />

        <v-alert v-if="alert" :type="alert.type" variant="tonal" class="mt-4" closable @click:close="alert = null">
            {{ alert.message }}
        </v-alert>

        <OrderChangeStaus v-model="showChangeStatus" :orderId="order.order_id" :currentStatus="order.status"
            :saveStatus="saveStatus" :sendEmail="sendStatusEmail" @saved="onSaved" />
        <OrderChangePaymentStaus v-model="showChangePaymentStatus" :orderId="order.order_id"
            :currentStatus="order.payment_status" :savePaymentStatus="savePaymentStatus" @saved="onSaved" />
    </div>

    <!-- ── Dialog faktury / korekty ───────────────────────────────────────────── -->
    <v-dialog v-model="docDialog" max-width="580" persistent>
        <v-card class="invoice-dialog">
            <v-card-title class="invoice-dialog__title">
                <v-icon
                    :icon="dialogType === 'credit_memo' ? 'mdi-file-document-edit-outline' : 'mdi-file-document-outline'"
                    :color="dialogType === 'credit_memo' ? '#f59e0b' : '#32aa27'"
                    size="20" style="margin-right:8px"
                />
                {{ dialogType === 'credit_memo' ? 'Wystaw fakturę korygującą' : 'Wystaw fakturę' }}
            </v-card-title>
            <v-card-text class="invoice-dialog__body">
                <div v-if="dialogType === 'credit_memo'" class="credit-ref">
                    <v-icon icon="mdi-information-outline" size="16" color="#f59e0b" />
                    Korekta do faktury: <strong>{{ order?.invoice_number }}</strong>
                </div>
                <div class="field-group">
                    <label class="field-label">{{ dialogType === 'credit_memo' ? 'Numer korekty *' : 'Numer faktury *' }}</label>
                    <div class="field-with-hint">
                        <input v-model="docNumber" class="field-input" :class="{ 'field-input--error': docNumberError }"
                            :placeholder="dialogType === 'credit_memo' ? 'np. KOR/01/06/2026' : 'np. 01/06/2026'"
                            @input="docNumberError = ''" />
                        <span v-if="loadingNextNumber" class="field-hint">Ładowanie...</span>
                    </div>
                    <p v-if="docNumberError" class="field-error">{{ docNumberError }}</p>
                </div>
                <div class="preview">
                    <div class="preview-section">
                        <div class="preview-heading">Nabywca</div>
                        <div class="preview-val bold">{{ order?.company || `${order?.firstname} ${order?.lastname}` }}</div>
                        <div class="preview-val">ul. {{ order?.street }}{{ order?.street_number ? ' ' + order?.street_number : '' }}</div>
                        <div class="preview-val">{{ order?.zip }} {{ order?.city }}</div>
                        <div class="preview-val muted">{{ order?.email }}</div>
                    </div>

                    <div class="preview-section">
                        <div class="preview-heading">Pozycje <span class="preview-hint">— edytuj wartości jeśli potrzeba</span></div>
                        <table class="items-edit">
                            <thead>
                                <tr>
                                    <th>Nazwa</th>
                                    <th class="col-num">Ilość</th>
                                    <th class="col-num">Cena</th>
                                    <th class="col-num">Razem</th>
                                    <th class="col-del"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in dialogItems" :key="i">
                                    <td><input v-model="item.name" class="ie-input" /></td>
                                    <td><input v-model.number="item.qty" type="number" min="0.01" step="any" class="ie-input ie-input--sm" /></td>
                                    <td><input v-model.number="item.price" type="number" min="0" step="0.01" class="ie-input ie-input--sm" /></td>
                                    <td class="col-total">{{ ((Number(item.qty)||0)*(Number(item.price)||0)).toFixed(2) }} zł</td>
                                    <td><button class="ie-del" @click="dialogItems.splice(i,1)" tabindex="-1">×</button></td>
                                </tr>
                            </tbody>
                        </table>
                        <button class="ie-add" @click="dialogItems.push({name:'',qty:1,price:0})">+ Dodaj pozycję</button>

                        <div class="shipping-row">
                            <span>Wysyłka:</span>
                            <input v-model.number="dialogShipping" type="number" min="0" step="0.01" class="ie-input ie-input--sm" />
                            <span>zł</span>
                        </div>

                        <div class="preview-total">
                            <span>{{ dialogType === 'credit_memo' ? 'Kwota korekty' : 'Razem do zapłaty' }}</span>
                            <span>{{ dialogTotal.toFixed(2) }} zł</span>
                        </div>
                    </div>

                    <div class="preview-section">
                        <div class="preview-heading">Adnotacje / Uwagi <span class="preview-hint">— pojawią się na fakturze</span></div>
                        <textarea v-model="dialogNotes" class="ie-textarea" rows="3" placeholder="Opcjonalne uwagi widoczne na fakturze..." />
                    </div>
                </div>
                <p v-if="saveError" class="save-error">{{ saveError }}</p>
            </v-card-text>
            <v-card-actions class="invoice-dialog__actions">
                <button class="btn-cancel" @click="docDialog = false" :disabled="saving">Anuluj</button>
                <button class="btn-save" :class="{ 'btn-save--credit': dialogType === 'credit_memo' }" @click="saveAndOpen" :disabled="saving">
                    <v-icon v-if="saving" icon="mdi-loading" size="16" style="margin-right:6px;animation:spin 1s linear infinite" />
                    <v-icon v-else icon="mdi-file-pdf-box" size="16" style="margin-right:6px" />
                    {{ saving ? 'Zapisywanie...' : 'Zapisz i otwórz PDF' }}
                </button>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin-client' });

const route = useRoute();
const { getOrderById, updateOrderStatus, updatePaymentStatus } = useOrder();
const order = ref(null);
const tab   = ref('products');
const showChangeStatus        = ref(false);
const showChangePaymentStatus = ref(false);
const alert = ref(null);

const tabs = [
    { id: 'products',         label: 'Produkty',  icon: 'mdi-cart-outline' },
    { id: 'payment_details',  label: 'Płatność',  icon: 'mdi-credit-card-outline' },
    { id: 'shipping_details', label: 'Dostawa',   icon: 'mdi-truck-outline' },
    { id: 'packing',          label: 'Pakowanie', icon: 'mdi-package-variant-closed' },
];

const fetchOrder = async () => { order.value = await getOrderById(route.params.id); };

const hexAlpha = (hex, alpha) => {
    const h = hex.replace('#', '').slice(0, 6);
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
};
onMounted(fetchOrder);

const calculateProductsTotal = (o) => {
    if (!o?.order_items?.length) return 0;
    return Number(o.order_items.reduce((s, i) => s + i.quantity * Number(i.price_snapshot), 0).toFixed(2));
};
const grandTotal = computed(() => {
    if (!order.value) return 0;
    return calculateProductsTotal(order.value) + Number(order.value.order_shipping_details?.price_gross ?? 0);
});

// ── Dialog ────────────────────────────────────────────────────────────────────
const docDialog         = ref(false);
const dialogType        = ref('invoice');
const docNumber         = ref('');
const docNumberError    = ref('');
const loadingNextNumber = ref(false);
const saving            = ref(false);
const saveError         = ref('');

const dialogItems    = ref([]);
const dialogShipping = ref(0);
const dialogNotes    = ref('');
const dialogTotal    = computed(() =>
    dialogItems.value.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.price) || 0), 0) + (Number(dialogShipping.value) || 0)
);

const openDialog = async (type) => {
    const existingNumber = type === 'invoice' ? order.value.invoice_number : order.value.credit_memo_number;
    if (existingNumber) {
        try {
            const inv = await $fetch(`/api/invoice/get?invoice_number=${encodeURIComponent(existingNumber)}`);
            dialogItems.value    = inv.items    ?? (order.value.order_items ?? []).map(i => ({ name: i.product?.display_name ?? '', qty: i.quantity, price: Number(i.price_snapshot) }));
            dialogShipping.value = inv.shipping ?? Number(order.value.order_shipping_details?.price_gross ?? 0);
            dialogNotes.value    = inv.notes    ?? '';
        } catch {
            dialogItems.value    = (order.value.order_items ?? []).map(i => ({ name: i.product?.display_name ?? '', qty: i.quantity, price: Number(i.price_snapshot) }));
            dialogShipping.value = Number(order.value.order_shipping_details?.price_gross ?? 0);
            dialogNotes.value    = '';
        }
        window.open(buildReceiptUrl(existingNumber, type === 'credit_memo'), '_blank');
        return;
    }
    dialogType.value = type; saveError.value = ''; docNumberError.value = ''; dialogNotes.value = '';
    dialogItems.value = (order.value.order_items ?? []).map(i => ({
        name: i.product?.display_name ?? '',
        qty: i.quantity,
        price: Number(i.price_snapshot),
    }));
    dialogShipping.value = Number(order.value.order_shipping_details?.price_gross ?? 0);
    docDialog.value = true; loadingNextNumber.value = true;
    try {
        const { invoice_number } = await $fetch(`/api/invoice/next-number?type=${type}`);
        docNumber.value = invoice_number;
    } catch { docNumber.value = ''; }
    loadingNextNumber.value = false;
};

const buildReceiptUrl = (invoiceNum, isCreditMemo) => {
    const params = new URLSearchParams({ invoice_number: invoiceNum });
    if (isCreditMemo) { params.set('type', 'credit_memo'); params.set('original', order.value.invoice_number ?? ''); }
    params.set('items', JSON.stringify(dialogItems.value));
    params.set('shipping', String(Number(dialogShipping.value)));
    if (dialogNotes.value.trim()) params.set('notes', dialogNotes.value.trim());
    return `/admin/order/receipt/${order.value.order_id}?${params}`;
};

const saveAndOpen = async () => {
    if (!docNumber.value.trim()) { docNumberError.value = 'Numer dokumentu jest wymagany.'; return; }
    saving.value = true; saveError.value = '';
    try {
        const isCreditMemo = dialogType.value === 'credit_memo';
        await $fetch('/api/invoice/create', { method: 'POST', body: {
            order_id: order.value.order_id, order_number: order.value.order_number,
            invoice_number: docNumber.value.trim(), type: dialogType.value,
            original_invoice_number: isCreditMemo ? order.value.invoice_number : null,
            items: dialogItems.value,
            shipping: Number(dialogShipping.value),
            notes: dialogNotes.value.trim() || null,
        }});
        await fetchOrder();
        docDialog.value = false;
        window.open(buildReceiptUrl(docNumber.value.trim(), isCreditMemo), '_blank');
    } catch (err) { saveError.value = err?.data?.statusMessage ?? 'Wystąpił błąd podczas zapisywania.'; }
    saving.value = false;
};

// ── Statusy ───────────────────────────────────────────────────────────────────
async function saveStatus({ orderId, status }) { await updateOrderStatus(orderId, status, order.value); await fetchOrder(); }
async function savePaymentStatus({ orderId, status }) {
    await updatePaymentStatus(orderId, status, order.value);
    if (status === 'paid') await updateOrderStatus(orderId, 'pending_approval', order.value);
    await fetchOrder();
}
async function sendStatusEmail({ status }) {
    if (status === 'processing') await useFetch('/api/order/processed', { method: 'POST', body: { order: order.value } });
    if (status === 'shipped')    await useFetch('/api/order/shipped',    { method: 'POST', body: { order: order.value } });
    if (status === 'completed')  await useFetch('/api/order/completed',  { method: 'POST', body: { order: order.value } });
    if (status === 'cancelled')  await useFetch('/api/order/cancelled',  { method: 'POST', body: { order: order.value } });
}
async function addToFurgonetka() {
    try {
        const { data, error } = await useFetch('/api/furgonetka/createShipment', { method: 'POST', body: { order: order.value } });
        if (error.value) throw error.value;
        alert.value = { type: 'success', message: "Paczka dodana do Furgonetki." };
    } catch { alert.value = { type: 'error', message: 'Nie udało się dodać do Furgonetki.' }; }
}
function onSaved() {}
</script>

<style scoped lang="scss">
.order-view { padding: 28px 32px; @media (max-width: 768px) { padding: 12px; } }

// ── Nagłówek ──────────────────────────────────────────────────────────────────
.page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
}
.header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
}
.action-btn {
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
    transition: all 0.15s;
    white-space: nowrap;
    &:hover { background: #f9fafb; border-color: #d1d5db; }
    &--invoice { background: #32aa27; color: #fff; border-color: #32aa27; &:hover { background: #279620; } }
    &--credit  { background: #f59e0b; color: #fff; border-color: #f59e0b; &:hover { background: #d97706; } }
}

// ── Status bar ─────────────────────────────────────────────────────────────────
.status-bar {
    display: flex;
    align-items: center;
    gap: 0;
    background: #fff;
    border: 1px solid #f3f4f6;
    border-radius: 12px;
    padding: 14px 20px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,.04);
}
.status-bar__sep { width: 1px; height: 32px; background: #f3f4f6; flex-shrink: 0; @media (max-width: 600px) { display: none; } }
.status-bar__item { display: flex; flex-direction: column; gap: 4px; }
.status-bar__label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: #9ca3af; }
.status-chip {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap;
}
.invoice-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background: #f0fdf4;
    color: #15803d;
    border: 1px solid #bbf7d0;
    cursor: pointer;
    transition: background .15s;
    white-space: nowrap;
    &:hover { background: #dcfce7; }
    &--credit { background: #fffbeb; color: #b45309; border-color: #fde68a; &:hover { background: #fef3c7; } }
}

// ── Info grid ─────────────────────────────────────────────────────────────────
.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
}
.info-card {
    background: #fff;
    border: 1px solid #f3f4f6;
    border-radius: 12px;
    padding: 4px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,.04);
}
.info-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    border-bottom: 1px solid #f9fafb;
    &:last-child { border-bottom: none; }
}
.info-label { font-size: 13px; color: #6b7280; flex: 1; }
.info-val {
    font-size: 13px;
    font-weight: 500;
    color: #111;
    text-align: right;
    &--bold { font-weight: 700; color: #32aa27; font-size: 14px; }
}

// ── Zakładki ──────────────────────────────────────────────────────────────────
.tabs {
    display: flex;
    gap: 4px;
    border-bottom: 2px solid #f3f4f6;
    margin-bottom: 16px;
    flex-wrap: wrap;
}
.tab {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 11px 18px;
    border: none;
    background: none;
    font-size: 15px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.15s;
    &:hover { color: #111; }
    &.active { color: #32aa27; border-bottom-color: #32aa27; font-weight: 600; }
}

// ── Dialog ────────────────────────────────────────────────────────────────────
.invoice-dialog {
    border-radius: 14px !important;
    &__title { font-size: 16px !important; font-weight: 700 !important; padding: 20px 20px 12px !important; display: flex; align-items: center; }
    &__body  { padding: 0 20px 8px !important; }
    &__actions { padding: 8px 20px 20px !important; display: flex; gap: 8px; justify-content: flex-end; }
}
.credit-ref {
    display: flex; align-items: center; gap: 6px;
    background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px;
    padding: 8px 12px; font-size: 13px; color: #92400e; margin-bottom: 14px;
}
.field-group  { margin-bottom: 16px; }
.field-label  { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.field-with-hint { display: flex; align-items: center; gap: 10px; }
.field-input  {
    flex: 1; padding: 9px 12px; border: 1px solid #e5e7eb; border-radius: 8px;
    font-size: 14px; font-weight: 600; outline: none; transition: border-color .15s;
    &:focus { border-color: #32aa27; } &--error { border-color: #ef4444; }
}
.field-hint  { font-size: 12px; color: #9ca3af; }
.field-error { font-size: 12px; color: #ef4444; margin-top: 4px; }
.preview {
    background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px;
    padding: 14px 16px; display: flex; flex-direction: column; gap: 14px;
}
.preview-heading { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #9ca3af; margin-bottom: 6px; }
.preview-val { font-size: 13px; color: #374151; line-height: 1.6; &.bold { font-weight: 600; color: #111; } &.muted { color: #9ca3af; font-size: 12px; } }
.preview-item {
    display: flex; justify-content: space-between; font-size: 13px; color: #374151;
    padding: 3px 0; border-bottom: 1px solid #f3f4f6; .muted { color: #9ca3af; }
}
.preview-total { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; color: #111; padding-top: 10px; margin-top: 6px; border-top: 2px solid #e5e7eb; }
.preview-hint  { font-size: 11px; font-weight: 400; color: #9ca3af; }

// ── Edytowalna tabela pozycji ─────────────────────────────────────────────────
.items-edit {
    width: 100%; border-collapse: collapse; margin: 8px 0 6px;
    th { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; padding: 4px 4px 6px; border-bottom: 1px solid #e5e7eb; text-align: left; }
    td { padding: 4px; vertical-align: middle; border-bottom: 1px solid #f3f4f6; }
    .col-num { width: 72px; }
    .col-del { width: 28px; }
    .col-total { font-size: 12px; font-weight: 600; color: #374151; text-align: right; white-space: nowrap; padding-right: 4px; }
}
.ie-input {
    width: 100%; padding: 5px 7px; border: 1px solid #e5e7eb; border-radius: 6px;
    font-size: 13px; outline: none; background: #fff; transition: border-color .15s;
    &:focus { border-color: #32aa27; }
    &--sm { width: 68px; text-align: right; }
}
.ie-del {
    width: 22px; height: 22px; border: none; background: #fee2e2; color: #ef4444;
    border-radius: 4px; cursor: pointer; font-size: 14px; line-height: 1;
    &:hover { background: #fecaca; }
}
.ie-add {
    background: none; border: 1px dashed #d1d5db; border-radius: 6px; padding: 5px 10px;
    font-size: 12px; color: #6b7280; cursor: pointer; margin-bottom: 10px;
    &:hover { background: #f9fafb; color: #374151; }
}
.shipping-row {
    display: flex; align-items: center; gap: 8px; padding: 8px 0 4px;
    border-top: 1px solid #f3f4f6; font-size: 13px; color: #374151;
    input { width: 80px; }
}
.ie-textarea {
    width: 100%; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px;
    font-size: 13px; font-family: inherit; resize: vertical; outline: none; transition: border-color .15s;
    &:focus { border-color: #32aa27; }
}

.save-error { font-size: 13px; color: #ef4444; margin-top: 12px; }
.btn-cancel {
    padding: 9px 16px; border: 1px solid #e5e7eb; border-radius: 8px;
    background: #fff; font-size: 13px; color: #374151; cursor: pointer;
    &:hover:not(:disabled) { background: #f9fafb; } &:disabled { opacity: .5; cursor: default; }
}
.btn-save {
    display: flex; align-items: center; padding: 9px 18px; border: none;
    border-radius: 8px; background: #32aa27; color: #fff; font-size: 13px;
    font-weight: 600; cursor: pointer; transition: background .15s;
    &:hover:not(:disabled) { background: #279620; } &:disabled { opacity: .6; cursor: default; }
    &--credit { background: #f59e0b !important; &:hover:not(:disabled) { background: #d97706 !important; } }
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
