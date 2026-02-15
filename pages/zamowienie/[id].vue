<template>
    <div v-if="order" class="order-page  mt-5 mt-mb-10">

        <div class="section">
            <h2 class="mb-3">Dziękujemy za złożenie zamówienia!</h2>
            <h1>Zamówienie: {{ order.order_number }}</h1>
            <h3 class="mt-2">Status: <span :style="{ color: getOrderStatusMeta(order.status).color }">{{
                getOrderStatusMeta(order.status).customer_label || getOrderStatusMeta(order.status).label }}</span>
            </h3>
            <p class="mt-2">Data: {{ formatDate(order.created_at) }}</p>
        </div>

        <div class="section">
            <h3>Status płatność: <span :style="{ color: getPaymentStatusMeta(order.payment_status).color }">{{
                getPaymentStatusMeta(order.payment_status).label }}</span></h3>
            <p class="mt-2">Metoda płatności: {{ order.order_payment_details.label }} - {{
                order.order_payment_details.description }}</p>
            <h3 class="mt-4">Do zapłaty: {{ (calculateProductsTotal(order) +
                order.order_shipping_details.price_gross).toFixed(2) }} zł</h3>
        </div>

        <div class="section"
            v-if="order.payment_status === 'pending' && order.order_payment_details.service === 'bank_transfer'">
        <h3 class="mb-2">
            Dane do przelewu:
        </h3>
        <p class="mb-1">Numer konta: <strong>94132015372252938930000001</strong></p>
        <p class="mb-1">Odbiorca: <strong>TIPLAST Iński Tomasz</strong></p>
        <p class="mb-1">Tytuł przelewu: <strong>Zamówienie {{ order.order_number }}</strong></p>
        <p>Kwota do zapłaty: <strong>{{ (calculateProductsTotal(order) +
            order.order_shipping_details.price_gross).toFixed(2) }} zł</strong></p>
            </div>
        <div class="section">


            <h3>Dane kontaktowe:</h3>
            <p class="mt-1">E-mail: {{ order.email }}</p>
            <p>Telefon: {{ order.phone }}</p>

            <h3 class="mt-4">Adres wysyłki:</h3>
            <p class="mt-1">{{ order.firstname }} {{ order.lastname }}</p>
            <p>{{ order.company || "" }}</p>
            <p>{{ order.street }}, {{ order.street_number }}</p>
            <p>{{ order.city }}, {{ order.zip }}</p>
            <p>{{ order.country === "PL" ? "Polska" : order.country }}</p>

            <p>
            <p class="mt-4">Metoda wysyłki: {{ order.order_shipping_details.service }} - {{
                order.order_shipping_details.type === "courier" ? "kurier" : order.order_shipping_details.type ===
                    "courier_cod" ? "Kurier COD" :
                    order.order_payment_details.type }}</p>
            </p>
            <p> Koszt wysyłki: {{ order.order_shipping_details.price_gross.toFixed(2) }} zł</p>
        </div>

        <div class="section">
            <h3>Produkty w zamówieniu:</h3>
            <OrderItem v-for="item in order.order_items" :key="item.id" :item="item" @update="loadCart"
                @remove="loadCart" />
        </div>

    </div>
</template>

<script setup>

const route = useRoute();

const { getOrderById } = useOrder()
const order = ref(null);
const tab = ref("products")

const fetchOrder = async () => {
    const id = route.params.id;
    order.value = await getOrderById(id)
}

onMounted(fetchOrder)

const calculateProductsTotal = (order) => {
    if (!order?.order_items?.length) return 0

    const total = order.order_items.reduce((sum, item) => {
        return sum + item.quantity * Number(item.price_snapshot)
    }, 0)

    return Number(total.toFixed(2))
}

</script>

<style scoped lang="scss">
.order-page {
    max-width: 1200px;
    margin: auto;
    padding: 20px;

    h1 {
        font-size: 24px;
    }
}

.page-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 50px;
}

@media (max-width: 768px) {
    .page-layout {
        grid-template-columns: 1fr;
    }
}


.admin-products {
    padding: 30px;
}

.row-1 {
    padding: 10px 20px;
    background-color: rgb(244, 244, 244);
    border-radius: 4px;
    display: flex;
    gap: 30px;
    margin-bottom: 20px;
}

.row-2 {
    padding: 10px 20px;
    background-color: rgb(244, 244, 244);
    border-radius: 4px;
    display: flex;
    gap: 80px;
}

.line {
    display: flex;
    margin: 10px 0;
    font-size: 18px;

    strong {
        margin: auto 8px;
    }
}

.order-status {
    font-size: 17px;
}



.section {
    background-color: #f4f4f4;
    padding: 20px;
    margin-bottom: 20px;
}
</style>