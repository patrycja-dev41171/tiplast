<template>
    <form ref="formEl" class="shipping-form" @submit.prevent="onSubmit">
        <section>
            <h3 class="mb-4">Metoda wysyłki:</h3>

            <div class="mb-8">
                <v-btn type="button" class="payment-btn mr-2 mb-2 mb-md-0" :class="{ active: cod === false }"
                    @click="cod = false">
                    Płatność online
                </v-btn>

                <v-btn type="button" class="payment-btn mb-2 mb-md-0" :class="{ active: cod === true }"
                    @click="cod = true">
                    Płatność przy odbiorze
                </v-btn>
            </div>

            <h4 class="mb-4">Wybierz rodzaj przesyłki:</h4>
            <div v-for="method in methods" :key="method.id" class="shipping-option"
                :class="{ active: form.method_id === method.id }" @click="select(method)">
                <label>
                    <input type="radio" name="shipping" :value="method.id" v-model="form.method_id" />

                    <div class="info">
                        <strong>{{ method.label }}</strong>
                        <span class="desc">{{ method.description }}</span>
                    </div>

                    <div class="price">
                        {{ method?.price_gross?.toFixed(2) }} zł
                    </div>
                </label>
            </div>

            <span v-if="showError('method_id')" class="error">
                {{ errors.method_id }}
            </span>
        </section>
    </form>
</template>


<script setup>
const emit = defineEmits(["submit", "update_cart"])
const props = defineProps({
    cart: {
        type: Object,
        required: true
    }
})

const formEl = ref(null)
defineExpose({
    submit: () => formEl.value?.requestSubmit()
})

const methods = ref([])
const cod = ref(props?.cart?.cart_shipping_details?.cod || false)
const loading = ref(false)
const error = ref(null)

const form = reactive({
    method_id: props.cart.cart_shipping_details.service_id || null
})

const errors = reactive({})
const touched = reactive({})

const { calculateParcels } = useCarts()
const { saveShippingDetails } = useCartShippingDetails()

const parcels = await calculateParcels()

/**
 * 🔥 LICZENIE KOSZTÓW
 */
const loadShippingCosts = async () => {
    loading.value = true
    error.value = null

    try {
        const res = await $fetch("/api/shipping/calculate", {
            method: "POST",
            body: {
                cart: props.cart,
                parcels: parcels,
                service: [
                    "dpd", "inpost"
                ],
                cod: cod.value
            }
        })

        methods.value = res.methods
    } catch (e) {
        error.value = "Nie udało się policzyć kosztów wysyłki"
    } finally {
        loading.value = false
    }
}

watch(cod, async (newVal) => {
    if (newVal === null) return

    form.method_id = null
    methods.value = []

    await loadShippingCosts()
})

onMounted(loadShippingCosts)


const validateField = (field) => {
    delete errors[field]

    if (field === "method_id" && !form.method_id) {
        errors.method_id = "Wybierz metodę wysyłki"
    }
}

const validate = () => {
    touched.method_id = true
    validateField("method_id")
    return Object.keys(errors).length === 0
}

const touch = (field) => {
    touched[field] = true
    validateField(field)
}

const select = async (method) => {

    await saveShippingDetails({
        cart_id: props.cart.id,
        cod: cod.value,
        service: method.service,
        type: method.type,
        service_id: method.id,
        price_gross: method.price_gross,
        price_net: method.price_net,
        currency: method.currency
    })
    form.method_id = method.id
    emit("update_cart")
    touch("method_id")
}

const showError = (field) =>
    touched[field] && errors[field]

const onSubmit = () => {
    if (!validate()) return

    const method = methods.value.find(m => m.id === form.method_id)

    emit("submit", {
        id: method.id,
        label: method.label,
        price: method.price
    })
}
</script>


<style scoped lang="scss">
.shipping-form section {
    border-radius: 8px;

    @media screen and (min-width: 960px) {
        background: #fafafa;
        padding: 24px;
        margin-bottom: 24px;
    }
}

.shipping-option {
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

.payment-btn {
    border: 1px solid #d1d5db;
    background: white;
    color: #111;
    transition: 0.2s;

    &.active {
        background: #2563eb;
        color: white;
        border-color: #2563eb;
    }
}
</style>
