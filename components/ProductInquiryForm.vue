<template>
  <form class="inquiry-form" @submit.prevent="handleSubmit">
    <h3>Jestem zaintersowany!</h3>
    <p class="subtitle">
      Wypełnij formularz, a skontaktujemy się z Tobą w sprawie wyceny i zakupu.
    </p>

    <v-text-field
      v-model="form.name"
      label="Imię i nazwisko"
      outlined
      dense
      required
      class="mb-4"
    />
    <v-text-field
      v-model="form.email"
      label="Adres e-mail"
      outlined
      dense
      type="email"
      required
      class="mb-4"
    />
    <v-text-field
      v-model="form.phone"
      label="Telefon"
      outlined
      dense
      required
      class="mb-4"
    />
    <v-text-field
      v-model="form.quantity"
      label="Ilość sztuk"
      outlined
      dense
      type="number"
      min="1"
      required
      class="mb-4"
    />
    <v-textarea
      v-model="form.message"
      label="Wiadomość (opcjonalnie)"
      outlined
      rows="3"
      class="mb-6"
    />

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
});

const loading = ref(false);
const success = ref(false);
const error = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  success.value = false;
  error.value = false;

  try {
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

  .error {
    color: #d93025;
    font-weight: 600;
  }
}
</style>
