<template>
    <div class="row-3">
        <div class="column">
            <div class="line">
                <p class="label">Kwota do zapłaty:</p>
                <p class="value">{{ (calculateProductsTotal(order) +
                    order.order_shipping_details.price_gross).toFixed(2) }} zł</p>
            </div>


            <div class="line  mt-8">
                <p class="label">COD:</p>
                <p class="value">{{ order.order_payment_details?.cod === false ? "Nie" : "Tak" }}</p>
            </div>
        </div>

        <div class="column">
            <div class="line">
                <p class="label">Status:</p>
                <p class="value" :style="{ color: getPaymentStatusMeta(order.payment_status).color }">{{
                    getPaymentStatusMeta(order.payment_status).label }}</p>
            </div>
            <div class="line  mt-8">
                <p class="label">Metoda płatności:</p>
                <p class="value">{{ order.order_payment_details?.label  || "-"}}</p>
            </div>

        </div>

        <div class="column">
            <div class="line mt-8"></div>
            <div class="line mt-8">
                <p class="label">Opis:</p>
                <p class="value">{{ order.order_payment_details?.description  || "-" }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: "admin-client",
});

const props = defineProps({
    order: {
        type: Object,
        required: true
    }
})

const calculateProductsTotal = (order) => {
    if (!order?.order_items?.length) return 0

    const total = order.order_items.reduce((sum, item) => {
        return sum + item.quantity * Number(item.price_snapshot)
    }, 0)

    return Number(total.toFixed(2))
}
</script>

<style scoped lang="scss">
.row-3 {
    background-color: rgb(244, 244, 244);
    border-radius: 4px;
    padding: 24px 20px;
    display: flex;
    gap: 80px;
    .column {
        flex-basis: 33%;
    }
}

.line {
    display: flex;
    align-items: center;
    font-size: 17px;

    .label {
        margin-right: 10px;
        font-weight: 600;
        width: auto;
    }

    .value {
        background-color: white;
        padding: 4px 15px;
        width: 100%;
        border-radius: 4px;
        font-size: 16px;
        flex: 1;
    }
}
</style>