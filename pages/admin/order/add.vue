<template>
    <div class="admin-products">
        <div class="buttons mb-6">
            <AdminPageHeader text="Dodaj nowe zamówienie" />
        </div>
        <v-form @submit.prevent="submitForm" ref="formRef">
            <v-row dense>

                <v-col cols="12">
                    <h3 class="mb-3">Dane klienta:</h3>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="form.email" label="Email" type="email" :rules="[rules.required, rules.email]"
                        required />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="form.phone" label="Phone" />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="form.firstname" label="First name" :rules="[rules.required]" />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="form.lastname" label="Last name" :rules="[rules.required]" />
                </v-col>



                <v-col cols="12" md="6">
                    <v-text-field v-model="form.company" label="Company" />
                </v-col>

                <v-col cols="12">
                    <h3 class="mb-3">Adres wysyłki:</h3>
                </v-col>


                <v-col cols="12" md="8">
                    <v-text-field v-model="form.street" label="Street" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="form.street_number" label="Street number" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="form.zip" label="ZIP" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="form.city" label="City" />
                </v-col>

                <v-col cols="12" md="4">
                    <v-select v-model="form.country" :items="countries" item-title="label" item-value="code"
                        label="Kraj" :rules="[rules.required]" />

                </v-col>

                <!-- ORDER STATUS -->
                <v-col cols="12" md="6">
                    <v-select v-model="form.status" :items="orderStatuses" label="Order status"
                        :rules="[rules.required]" />
                </v-col>

                <!-- PAYMENT STATUS -->
                <v-col cols="12" md="6">
                    <v-select v-model="form.payment_status" :items="paymentStatuses" label="Payment status"
                        :rules="[rules.required]" />
                </v-col>

                <v-col cols="12">
                    <v-btn type="submit" color="primary" block>
                        Submit
                    </v-btn>
                </v-col>
            </v-row>

            <!-- DEBUG -->
            <pre>{{ form }}</pre>
        </v-form>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: "admin-client",
});
import { ref } from 'vue'

const formRef = ref(null)

const form = ref({
    email: '',
    phone: '',
    country: 'PL',
    firstname: '',
    lastname: '',
    street: '',
    street_number: '',
    zip: '',
    city: '',
    company: '',
    regulamin: true,
    privacy: true,
    marketing: true,
    order_number: '',
    status: '',
    payment_status: ''
})

const orderStatuses = [
    'new',
    'processing',
    'shipped',
    'completed',
    'cancelled'
]

const countries = [{ code: "PL", label: "Polska" }]

const paymentStatuses = [
    'unpaid',
    'paid',
    'refunded',
    'failed'
]

const rules = {
    required: v => !!v || 'Required field',
    email: v => /.+@.+\..+/.test(v) || 'Invalid email',
    mustBeTrue: v => v === true || 'Required'
}

const submitForm = async () => {
    const { valid } = await formRef.value.validate()
    if (!valid) return

    console.log('FORM DATA:', form.value)

    // await $fetch('/api/orders', {
    //   method: 'POST',
    //   body: form.value
    // })
}
</script>


<style scoped lang="scss">
.form {
    display: grid;
    gap: 12px;

}

input {
    padding: 8px;
    background-color: #e5e7eb;
}

.admin-products {
    padding: 30px;
}

.row-1 {
    padding: 10px 20px;
    background-color: rgb(244, 244, 244);
    border-radius: 4px;
    width: 100%;
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

.flex-box {
    display: flex;
}
</style>
