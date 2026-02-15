<template>
    <form ref="formEl" class="checkout-form" @submit.prevent="onSubmit">
        <section>
            <h3 class="mb-4">Dane kontaktowe:</h3>

            <div class="field">
                <label>Email *</label>
                <input v-model="form.email" type="email" @blur="touch('email')" />
                <span v-if="showError('email')" class="error">
                    {{ errors.email }}
                </span>
            </div>

            <div class="field">
                <label>Telefon *</label>

                <div class="phone-input">
                    <span class="prefix">+48</span>

                    <input v-model="form.phone" @blur="touch('phone')" placeholder="123456789" maxlength="9"
                        inputmode="numeric" />
                </div>

                <span v-if="showError('phone')" class="error">
                    {{ errors.phone }}
                </span>
            </div>
        </section>



        <section>
            <h3 class="mb-4">Adres Dostawy:</h3>
            <div class="row">
                <div class="field">
                    <label>Imię *</label>
                    <input v-model="form.firstname" @blur="touch('firstname')" />
                    <span v-if="showError('firstname')" class="error">
                        {{ errors.firstname }}
                    </span>
                </div>

                <div class="field">
                    <label>Nazwisko *</label>
                    <input v-model="form.lastname" @blur="touch('lastname')" />
                    <span v-if="showError('lastname')" class="error">
                        {{ errors.lastname }}
                    </span>
                </div>
            </div>
            <div class="field">
                <label>Firma</label>
                <input v-model="form.company" />
            </div>
            <div class="row">
                <div class="field">
                    <label>Ulica *</label>
                    <input v-model="form.street" @blur="touch('street')" />
                    <span v-if="showError('street')" class="error">
                        {{ errors.street }}
                    </span>
                </div>

                <div class="field">
                    <label>Numer domu / mieszkania *</label>
                    <input v-model="form.street_number" @blur="touch('street_number')" />
                    <span v-if="showError('street_number')" class="error">
                        {{ errors.street_number }}
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="field">
                    <label>Kod pocztowy *</label>
                    <input v-model="form.zip" @blur="touch('zip')" @input="form.zip = form.zip
                        .replace(/[^0-9]/g, '')
                        .slice(0, 5)
                        .replace(/^(\d{2})(\d{0,3})/, '$1-$2')" placeholder="00-000" />
                    <span v-if="showError('zip')" class="error">
                        {{ errors.zip }}
                    </span>
                </div>



                <div class="field">
                    <label>Miasto *</label>
                    <input v-model="form.city" @blur="touch('city')" />
                    <span v-if="showError('city')" class="error">
                        {{ errors.city }}
                    </span>
                </div>
            </div>

            <div class="field">
                <label>Kraj *</label>
                <select v-model="form.country" @change="touch('country')">
                    <option v-for="c in countries" :key="c.code" :value="c.code">
                        {{ c.label }}
                    </option>
                </select>
                <span v-if="showError('country')" class="error">
                    {{ errors.country }}
                </span>
            </div>
        </section>

        <section>
            <h3 class="mb-4">Zgody:</h3>
            <div class="checkbox-field">
                <label class="checkbox">
                    <input type="checkbox" v-model="form.regulamin" @change="touch('regulamin')" />
                    <span>
                        Akceptuję
                        <NuxtLink to="/regulamin" target="_blank">regulamin </NuxtLink>sklepu tiplast.pl *
                    </span>
                </label>

                <span v-if="showError('regulamin')" class="error">
                    {{ errors.regulamin }}
                </span>
            </div>

            <div class="checkbox-field">
                <label class="checkbox">
                    <input type="checkbox" v-model="form.privacy" @change="touch('privacy')" />
                    <span>
                        Akceptuję
                        <NuxtLink to="/polityka-prywatnosci" target="_blank">
                            politykę prywatności
                        </NuxtLink>
                        *
                    </span>
                </label>

                <span v-if="showError('privacy')" class="error">
                    {{ errors.privacy }}
                </span>
            </div>

            <div class="checkbox-field">
                <label class="checkbox">
                    <input type="checkbox" v-model="form.marketing" />
                    <span>
                        Wyrażam zgodę na otrzymywanie informacji handlowych
                        drogą elektroniczną.
                    </span>
                </label>
            </div>
        </section>

    </form>
</template>

<script setup>
const emit = defineEmits(["submit"])

const props = defineProps({
    cart: Object,
})

const formEl = ref(null)
defineExpose({
    submit: () => formEl.value?.requestSubmit()
})

const countries = [{ code: "PL", label: "Polska" }]

const form = reactive({
    email: props.cart.email || "",
    firstname: props.cart.firstname || "",
    lastname: props.cart.lastname || "",
    company: props.cart.company || null,
    street: props.cart.street || "",
    street_number: props.cart.street_number || "",
    zip: props.cart.zip || "",
    city: props.cart.city || "",
    country: props.cart.country || "PL",
    phone: props.cart.phone?.replace(/^\+48/, "") || "",
    regulamin: props.cart.regulamin || false,
    privacy: props.cart.privacy || false,
    marketing: props.cart.marketing || false,
})

const errors = reactive({})
const touched = reactive({})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const phoneRegex = /^\d{9}$/
const zipRegex = /^\d{2}-\d{3}$/



const validateField = async (field) => {
    delete errors[field]

    switch (field) {
        case "email":
            if (!form.email) {
                errors.email = "Email jest wymagany"
            } else if (!emailRegex.test(form.email)) {
                errors.email = "Niepoprawny adres email"
            }
            break

        case "phone":
            if (!form.phone) {
                errors.phone = "Numer telefonu jest wymagany"
            } else if (!phoneRegex.test(form.phone)) {
                errors.phone = "Numer musi mieć 9 cyfr"
            }
            break

        case "firstname":
            if (!form.firstname) errors.firstname = "Pole wymagane"
            break

        case "lastname":
            if (!form.lastname) errors.lastname = "Pole wymagane"
            break

        case "street":
            if (!form.street) errors.street = "Pole wymagane"
            break

        case "street_number":
            if (!form.street_number)
                errors.street_number = "Pole wymagane"
            break

        case "zip":
            if (!zipRegex.test(form.zip)) {
                errors.zip = "Niepoprawny format"
            } else {
                const exists = await validateZipExistence(form.zip)
                if (!exists) errors.zip = "Kod pocztowy nie istnieje"
            }

            break

        case "city":
            if (!form.city) errors.city = "Pole wymagane"
            break

        case "country":
            if (!form.country) errors.country = "Wybierz kraj"
            break

            case "regulamin":
            if (!form.regulamin) errors.regulamin = "Pole wymagane"
            break

            case "privacy":
            if (!form.privacy) errors.privacy = "Pole wymagane"
            break
    }
}

const validate = async () => {
    Object.keys(errors).forEach(k => delete errors[k])

    const fields = [
        "email",
        "phone",
        "firstname",
        "lastname",
        "street",
        "street_number",
        "zip",
        "city",
        "country"
    ]

    for (const f of fields) {
        touched[f] = true
        await validateField(f)
    }

    return Object.keys(errors).length === 0
}

const validateZipExistence = async (zip) => {
    const res = await fetch(`https://api.zippopotam.us/pl/${zip}`)
    if (res.ok) {
        const data = await res.json()
        form.city = data.places[0]["place name"]
    }
    return res.ok
}



Object.keys(form).forEach((field) => {
    watch(
        () => form[field],
        async () => {
            if (touched[field]) await validateField(field)
        }
    )
})


const touch = async (field) => {
    touched[field] = true
    await validateField(field)
}


const showError = (field) =>
    touched[field] && errors[field]


const onSubmit = async () => {
    if (!(await validate())) return

    emit("submit", {
        ...form,
        phone: `+48${form.phone}`
    })
}

</script>


<style scoped lang="scss">
.checkout-form {
    border-radius: 8px;

    section {
        margin-bottom: 24px;
        @media screen  and (min-width: 960px) {
        background-color: #fafafa;
        padding: 24px;
        }
    }
}

.field {
    margin-bottom: 14px;
}

.field label {
    display: block;
    font-weight: 500;
    margin-bottom: 4px;
    font-size: 15px;
}

input,
select {
    width: 100%;
    padding: 7px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background-color: white;
    margin-bottom: 8px;
}

.row {
    gap: 16px;

    div {
        flex-basis: 100%;
    }
    @media screen and (min-width: 960px) {
    display: flex;
    }
}

.error {
    color: #c0392b;
    font-size: 13px;
}

.phone-input {
    display: flex;
    align-items: center;
}

.prefix {
    padding: 7px 10px;
    margin-bottom: 8px;
    background: #e5e7eb;
    border: 1px solid #ccc;
    border-right: none;
    border-radius: 6px 0 0 6px;
    font-weight: 600;
    color: #374151;
}

.phone-input input {
    border-radius: 0 6px 6px 0;
    border-left: none;
}

.checkbox-field {
  margin-top: 12px;
}

.checkbox {
    display: flex;
  align-items: flex-start;
  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  input {
    width: 20px;
    min-width: 20px;
    min-height: 20px;
    height: 20px;
    margin-right: 15px;
  }

  a {
    color: #2563eb;
    text-decoration: underline;
  font-size: 15px;
  font-weight: 600;

  }
}

</style>
