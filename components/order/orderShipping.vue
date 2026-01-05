<template>
    <div class="row-3  mb-8 mt-8">
        <div class="column">
            <div class="line">
                <p class="label">Koszt dostawy:</p>
                <p class="value">{{ (order.order_shipping_details.price_gross).toFixed(2) }} zł</p>
            </div>
            <div class="line  mt-8">
                <p class="label">COD:</p>
                <p class="value">{{ order.order_shipping_details?.cod === false ? "Nie" : "Tak" }}</p>
            </div>
        </div>

        <div class="column">
            <div class="line">
                <p class="label">Serwis:</p>
                <p class="value">{{ order.order_shipping_details.service }}</p>
            </div>
        </div>

        <div class="column">
            <div class="line">
                <p class="label">Typ:</p>
                <p class="value">{{ order.order_shipping_details.type === "courier" ? "kurier" : order.order_shipping_details.type === "courier_cod" ? "Kurier COD" :
                    order.order_payment_details.type }}</p>
            </div>
        </div>
    </div>
    <div class="row-3 mb-8">
        <h3 class="mb-3">Dane klienta:</h3>
        <div class="column">
            <div class="line mb-4">
                <p class="label">Email:</p>
                <p class="value">{{ order.email }}</p>
            </div>
            
            <div class="line mb-4">
                <p class="label">Imię:</p>
                <p class="value">{{ order.firstname }}</p>
            </div>

            <div class="line mb-4">
                <p class="label">Firma:</p>
                <p class="value">{{ order.company || "-" }}</p>
            </div>
        </div>
         <div class="column">
            <div class="line mb-4">
                <p class="label">Telefon:</p>
                <p class="value">{{ order.phone }}</p>
            </div>
           
            <div class="line mb-4">
                <p class="label">Nazwisko:</p>
                <p class="value">{{ order.lastname }}</p>
            </div>
        </div>
    </div>
    <div class="row-3">
    <h3 class="mb-3">Adres dostawy:</h3>
        <div class="column">
            <div class="line mb-4">
                <p class="label">Ulica:</p>
                <p class="value">{{ order.street }}</p>
            </div>
             <div class="line mb-4">
                <p class="label">Kod pocztowy:</p>
                <p class="value">{{ order.zip }}</p>
            </div>

             <div class="line mb-4">
                <p class="label">Kraj:</p>
                <p class="value">{{ order.country === "PL" ? "Polska" : "-" }}</p>
            </div>
           
        </div>
         <div class="column">
             <div class="line mb-4">
                <p class="label">Numer:</p>
                <p class="value">{{ order.street_number }}</p>
            </div>
           
           
            <div class="line mb-4">
                <p class="label">Miasto:</p>
                <p class="value">{{ order.city}}</p>
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