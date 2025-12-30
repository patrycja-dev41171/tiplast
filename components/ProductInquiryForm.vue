<template>
  <form class="inquiry-form" @submit.prevent="handleSubmit">
    <h3>Jestem zaintersowany!</h3>
    <p class="subtitle">
      Wypełnij i wyślij formularz, a my skontaktujemy się z Tobą w sprawie możliwej realizacji zamówienia i zakupu.
    </p>

    <v-text-field v-model="form.name" label="Imię i nazwisko" outlined dense required class="mb-4" />
    <v-text-field v-model="form.email" label="Adres e-mail" outlined dense type="email" required class="mb-4" />
    <v-text-field v-model="form.phone" label="Telefon" outlined dense required class="mb-4" />
    <v-text-field v-model="form.quantity" label="Ilość sztuk" outlined dense type="number" min="1" required
      class="mb-4" />
    <v-textarea v-model="form.message" label="Wiadomość (opcjonalnie)" outlined rows="3" class="mb-4" />

    <div class="checkbox">
      <input type="checkbox" id="policy" v-model="form.policy" />
      <label for="policy">
        Akceptuję politykę prywatności oraz wyrażam zgodę na przetwarzanie danych
        w celu kontaktu zwrotnego. *
      </label>
    </div>
    <small v-if="errors.policy" class="error-text">
      {{ errors.policy }}
    </small>

    <div class="checkbox mt-4 mb-6">
      <input type="checkbox" id="marketing" v-model="form.marketing" />
      <label for="marketing">
        Chcę otrzymywać informacje marketingowe.
      </label>
    </div>


    <v-btn type="submit" color="#32aa27" dark :loading="loading" block>
      Wyślij zapytanie
    </v-btn>

    <p v-if="success" class="success mt-4">
      ✅ Dziękujemy! Wiadomość została wysłana. Skontaktujemy się w ciągu 48
      godzin.
    </p>
    <p v-if="error" class="error mt-4">❌ Wystąpił błąd, spróbuj ponownie.</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useFetch } from "#app";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const form = ref({
  name: "",
  email: "",
  phone: "",
  quantity: 1,
  message: "",
  marketing: false,
  policy: false,
});

const errors = reactive({});
const loading = ref(false);
const success = ref(false);
const error = ref(false);

function validate() {
  errors.name = form.value.name ? "" : "Podaj imię i nazwisko.";
  errors.email = /\S+@\S+\.\S+/.test(form.value.email)
    ? ""
    : "Podaj poprawny adres e-mail.";
  errors.phone = form.value.phone ? "" : "Podaj numer telefonu.";
  errors.message = form.value.message ? "" : "Wpisz wiadomość.";
  errors.policy = form.value.policy ? "" : "Musisz zaakceptować politykę prywatności.";

  return !Object.values(errors).some(Boolean);
}

const { addMessage } = useMessages()

const handleSubmit = async () => {

  if (!validate()) return;

  loading.value = true;
  success.value = false;
  error.value = false;


  try {
    const message = `
       <h3>Nowe zapytanie o produkt</h3>
        <p><strong>Produkt:</strong> ${props.product.display_name}</p>
        <p><strong>SKU:</strong> ${props.product.sku}</p>
        <p><strong>Link:</strong> ${`http://tiplast.pl/produkt/${props.product.url}`}</p>
        <p><strong>Ilość sztuk:</strong> ${form.value.quantity}</p>
        <hr>
        <p><strong>Imię i nazwisko:</strong> ${form.value.name}</p>
        <p><strong>Email:</strong> ${form.value.email}</p>
        <p><strong>Telefon:</strong> ${form.value.phone}</p>
        <p><strong>Wiadomość:</strong><br>${form.value.message}</p>
      `

    const { error: dbError } = await addMessage(form.value, message, "formularz kontaktowy", `Zapytanie o produkt`)

    if (dbError) {
      console.error("DB ERROR", dbError);
      throw new Error("Błąd zapisu do bazy");
    }

    const { saveMarketingContact } = useMarketingContacts()

    if (form.value.marketing) {
      await saveMarketingContact(form)
    }

    const { data, error: fetchError } = await useFetch("/api/inquiry", {
      method: "POST",
      body: {
        ...form.value,
        product: props.product.display_name,
        sku: props.product.sku,
        link: `http://tiplast.pl/produkt/${props.product.url}`,
      },
    });

    if (fetchError.value) throw fetchError.value;

    success.value = true;
    form.value = { name: "", email: "", phone: "", quantity: 1, message: "" };
  } catch (e) {
    console.error("Błąd:", e);
    error.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.inquiry-form {
  background: #f8f8f8;
  padding: 30px;
  max-width: 700px;
  margin: 40px 0 0;

  h3 {
    color: #32aa27;
    margin-bottom: 8px;
  }

  .subtitle {
    color: #666;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .success {
    color: #32aa27;
    font-weight: 600;
  }

  .error,
  .error-text {
    color: #d93025;
    font-weight: 600;
  }
}
</style>
