<template>
    <form ref="formEl" @submit.prevent="onSubmit" class="payment-form">
        <section>
            <h3 class="mb-4">Metoda płatności</h3>

            <div v-for="method in methods" :key="method.id" class="payment-option"
                :class="{ active: form.method === method.id }" @click="select(method.id)">
                <label>
                    <input type="radio" name="payment" :value="method.id" v-model="form.method" />
                    <div class="info">
                        <strong>{{ method.label }}</strong>
                        <span class="desc">{{ method.description }}</span>
                    </div>
                </label>

            </div>

            <span v-if="error" class="error">{{ error }}</span>
        </section>
    </form>
</template>

<script setup>
import { useCartPaymentDetails } from '~/composables/useCartPaymentDetails';

const emit = defineEmits(["submit"])

const formEl = ref(null)
defineExpose({
    submit: () => formEl.value?.requestSubmit()
})

const props = defineProps({
    cart: {
        type: Object,
        required: true
    }
})

const allMethods = [
    //   { id: "p24", label: "Płatność online (Przelewy24)" },
    { id: "bank_transfer", label: "Przelew tradycyjny", description: "na konto bankowe sprzedawcy" },
    { id: "cod", label: "Płatność przy odbiorze", description: "Gotówka, karta, BLIK" }
]

const filterAllMethods = (all) => {
    if (props?.cart?.cart_shipping_details?.cod) {
        return all.filter((e) => e.id === "cod")
    } else {
        return all
    }
}

const methods = filterAllMethods(allMethods)

const form = reactive({
    method: null
})

const { savePaymentDetails } = useCartPaymentDetails()

const error = ref(null)

const select = async (id) => {
    const method = methods.find(e => e.id === id)

    await savePaymentDetails({
        cart_id: props.cart.id,
        service: id,
        label: method.label,
        description: method.description,
        cod: props?.cart?.cart_shipping_details?.cod
    })

    form.method = id
    error.value = null
}

const onSubmit = () => {
    if (!form.method) {
        error.value = "Wybierz metodę płatności"
        return
    }

    emit("submit", {
        method: form.method
    })
}
</script>

<style scoped lang="scss">
.payment-form section {
    border-radius: 8px;

    @media screen and (min-width: 960px) {
        background-color: #fafafa;
        padding: 24px;
        margin-bottom: 24px;

    }
}

.payment-option {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 14px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;

    &.active {
        border-color: #2563eb;
        background: #eff6ff;
    }

    label {
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
    }

    input {
        margin: 0;
    }

    .info {
        flex: 1;

        .desc {
            display: block;
            font-size: 13px;
            color: #555;
        }
    }

    .price {
        font-weight: 600;
        white-space: nowrap;
    }
}


.error {
    color: #c0392b;
    font-size: 13px;
}
</style>
