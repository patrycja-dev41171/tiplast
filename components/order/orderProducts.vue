<template>
        <div class="row-3">

            <table class="order-items">
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Nazwa</th>
                        <th>Kolor</th>
                        <th>Ilość</th>
                        <th>Cena szt.</th>
                        <th>Razem</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in order.order_items" :key="item.id">
                        <!-- Zdjęcie -->
                        <td class="image-cell">
                            <img :src="item.product.photos?.[0]?.url" :alt="item.product.display_name" />
                        </td>

                        <!-- Nazwa -->
                        <td>
                            <NuxtLink :to="`/admin/products/view/${item.product.id}`" class="product-link"
                                target="_blank">
                                {{ item.product.display_name }}
                            </NuxtLink>
                        </td>

                        <!-- Kolor -->
                        <td>
                            <span class="color-dot" :style="{ backgroundColor: item.product.color }" />
                        </td>

                        <!-- Ilość -->
                        <td>{{ item.quantity }}</td>

                        <!-- Cena sztuki -->
                        <td>{{ Number(item.price_snapshot).toFixed(2) }} zł</td>

                        <!-- Cena razem -->
                        <td class="total">
                            {{ (item.quantity * item.price_snapshot).toFixed(2) }} zł
                        </td>
                    </tr>
                </tbody>
            </table>
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
</script>

<style scoped lang="scss">
.row-3 {
    background-color: rgb(244, 244, 244);
    border-radius: 4px;
    padding: 10px 20px;

    h3 {
        margin-bottom: 15px;
    }
}

.order-items {
    width: 100%;
    border-collapse: collapse;
    background: #fff;

    th,
    td {
        padding: 10px 12px;
        border-bottom: 1px solid #e5e7eb;
        text-align: left;
        font-size: 15px;
    }

    th {
        background-color: rgb(244, 244, 244);
        font-weight: 600;
    }

    .image-cell img {
        width: 58px;
        height: 58px;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid #ddd;
    }

    .product-link {
        color: black;
        font-weight: 500;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    .color-dot {
        display: inline-block;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1px solid #ccc;
    }

    .total {
        font-weight: 600;
    }
}
</style>