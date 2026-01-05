<template>
    <div v-if="order" class="admin-products">
        <AdminPageHeader :text="`Zamówienie ${order.order_number}`" />

        <div class="row-1">
            <div class="order-status">Status: <strong :style="{ color: getOrderStatusMeta(order.status).color }">{{
                getOrderStatusMeta(order.status).label }}</strong></div>

            <div class="order-status">Płatność: <strong :style="{ color: getOrderStatusMeta(order.status).color }">{{
                getOrderStatusMeta(order.status).label }}</strong></div>
        </div>
        <div class="row-2">
            <div>
                <div class="line">
                    Numer zamówienia: <strong>{{ order.order_number }}</strong>
                </div>
                <div class="line">Data zamówienia:<strong>{{ formatDate(order.created_at) }}</strong></div>
                <div class="line">Klient: <strong> {{ order.firstname }} {{ order.lastname }}</strong></div>
                <div class="line">Email: <strong>{{ order.email }}</strong></div>
            </div>
            <div>
                <div class="line">
                    Wartość zamówienia: <strong>{{ (calculateProductsTotal(order) +
                        order.order_shipping_details.price_gross).toFixed(2) }} zł</strong>
                </div>
                <div class="line">
                    Wartość produktów: <strong>{{ calculateProductsTotal(order).toFixed(2) }} zł</strong>
                </div>
                <div class="line">
                    Koszt wysyłki: <strong>{{ order.order_shipping_details.price_gross.toFixed(2) }} zł</strong>
                </div>
            </div>
        </div>
        <div class="buttons mt-6">
            <v-btn class="tab-btn" :class="{ active: tab === 'products' }" @click="tab = 'products'">
                Produkty
            </v-btn>

            <v-btn class="tab-btn" :class="{ active: tab === 'payment_details' }" @click="tab = 'payment_details'">
                Płatność
            </v-btn>

            <v-btn class="tab-btn" :class="{ active: tab === 'shipping_details' }" @click="tab = 'shipping_details'">
                Dostawa
            </v-btn>

            <v-btn class="tab-btn" :class="{ active: tab === 'packing' }" @click="tab = 'packing'">
                Pakowanie
            </v-btn>
        </div>
        <OrderProducts v-if="tab === 'products'" :order="order" />
        <OrderPayment v-if="tab === 'payment_details'" :order="order" />
        <OrderShipping v-if="tab === 'shipping_details'" :order="order" />
        <OrderPacking v-if="tab === 'packing'" :order="order" />
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: "admin-client",
});

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

.buttons {
    display: flex;
    gap: 10px;
}

.tab-btn {
    background-color: #f3f4f6 !important;
    color: #374151 !important;
    font-weight: 500;
    font-size: 16px;
    text-transform: none;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
        background-color: #e5e7eb !important;
    }

    &.active {
        background-color: #2563eb !important;
        color: #ffffff !important;
    }
}
</style>