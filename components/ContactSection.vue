<template>
  <section class="contact-section">
    <div class="contact-container">
      <!-- Lewa kolumna: formularz -->
      <div class="contact-form">
        <h2>Napisz do nas!</h2>
        <p>Jesteśmy tutaj, aby Ci pomóc!</p>

        <form @submit.prevent="handleSubmit">
          <!-- Imię i nazwisko -->
          <label>
            Imię i nazwisko *
            <input type="text" v-model.trim="form.name" :class="{ error: errors.name }" placeholder="Jan Kowalski" />
            <small v-if="errors.name">{{ errors.name }}</small>
          </label>

          <!-- E-mail -->
          <label>
            E-mail *
            <input type="email" v-model.trim="form.email" :class="{ error: errors.email }"
              placeholder="email@domena.pl" />
            <small v-if="errors.email">{{ errors.email }}</small>
          </label>

          <!-- Telefon -->
          <label>
            Numer tel. *
            <input type="tel" v-model.trim="form.phone" :class="{ error: errors.phone }"
              placeholder="+48 555-555-555" />
            <small v-if="errors.phone">{{ errors.phone }}</small>
          </label>

          <!-- Wiadomość -->
          <label>
            Wiadomość *
            <textarea v-model.trim="form.message" rows="5" :class="{ error: errors.message }"
              placeholder="Twoja wiadomość..."></textarea>
            <small v-if="errors.message">{{ errors.message }}</small>
          </label>

          <!-- Zgoda -->
          <div class="checkbox">
            <input type="checkbox" id="consent" v-model="form.consent" />
            <label for="consent">
              Akceptuję politykę prywatności oraz wyrażam zgodę na przetwarzanie danych
              w celu kontaktu zwrotnego. *
            </label>
          </div>
          <small v-if="errors.consent" class="error-text">{{
            errors.consent
            }}</small>

          <div class="checkbox">
            <input type="checkbox" id="marketing" v-model="form.marketing" />
            <label for="marketing">Chcę otrzymywać informacje marketingowe.</label>
          </div>

          <!-- Komunikat -->
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

          <!-- Przycisk -->
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? "Wysyłanie..." : "Wyślij" }}
          </button>
        </form>
      </div>

      <!-- Prawa kolumna: mapa + dane -->
      <div class="contact-info">
        <iframe
          src="https://www.google.com/maps/embed/v1/place?q=Papowo%20Biskupie%2031, Papowo%20Biskupie, Kujawsko%20-%20Pomorskie 86-221 Polska&key=AIzaSyDygu92JJ_MAMG__b5A0xMKNWHP4vgHER4"
          width="100%" height="400" style="border: 0" allowfullscreen="" loading="lazy"></iframe>

        <div class="info-box">
          <h3>Napisz do nas lub zadzwoń!</h3>
          <p>
            <a href="mailto:kontakt.tiplast@gmail.com">E-mail: kontakt.tiplast@gmail.com</a>
          </p>
          <p>
            <a href="tel:+48608467068">Telefon: +48 608 467 068</a>
          </p>

          <h3>Lokalizacja</h3>
          <p>
            Papowo Biskupie 31<br />
            Kujawsko-Pomorskie, 86-221<br />
            Polska
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";

const form = reactive({
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
  marketing: false,
});

const errors = reactive({});
const isLoading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

function validate() {
  errors.name = form.name ? "" : "Podaj imię i nazwisko.";
  errors.email = /\S+@\S+\.\S+/.test(form.email)
    ? ""
    : "Podaj poprawny adres e-mail.";
  errors.phone = form.phone ? "" : "Podaj numer telefonu.";
  errors.message = form.message ? "" : "Wpisz wiadomość.";
  errors.consent = form.consent ? "" : "Musisz wyrazić zgodę.";

  return !Object.values(errors).some(Boolean);
}

const { addMessage } = useMessages()

async function handleSubmit() {
  successMessage.value = "";
  errorMessage.value = "";

  if (!validate()) return;

  isLoading.value = true;
  try {
    const message = `
        <h3>Wiadomość z formularza kontaktowego</h3>
        <p><strong>Imię i nazwisko:</strong> ${form.name}</p>
        <p><strong>E-mail:</strong> ${form.email}</p>
        <p><strong>Telefon:</strong> ${form.phone}</p>
        <p><strong>Wiadomość:</strong><br>${form.message}</p>
      `

    const { error: dbError } = await addMessage(form, message, "formularz kontaktowy", `Wiadomość z formularza kontaktowego`)
    if (dbError) {
      console.error("DB ERROR", dbError);
      throw new Error("Błąd zapisu do bazy");
    }

    const { saveMarketingContact } = useMarketingContacts()

    if (form.marketing) {
      await saveMarketingContact(form)
    }

    const { error } = await useFetch("/api/contact", {
      method: "POST",
      body: { ...form },
    });

    if (error.value) throw new Error(error.value.message);

    successMessage.value = "Dziękujemy! Wiadomość została wysłana.";
    Object.keys(form).forEach((k) => (form[k] = k === "consent" ? false : ""));
  } catch (err) {
    errorMessage.value = "Wystąpił błąd przy wysyłaniu wiadomości.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped lang="scss">
.contact-section {
  padding: 40px 20px;

  .contact-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0px 24px;

    @media (min-width: 768px) {
      flex-direction: row;
      gap: 60px;
    }
  }

  .contact-form {
    flex: 1;

    h2 {
      font-size: 28px;
      color: #32aa27;
      margin-bottom: 10px;
    }

    p {
      color: #444;
      margin-bottom: 25px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;

      label {
        display: flex;
        flex-direction: column;
        font-weight: 500;
        color: #333;
        font-size: 15px;

        input,
        textarea {
          margin-top: 6px;
          padding: 10px;
          border: 1px solid #ccc;
          font-size: 15px;
          transition: border 0.2s;

          &.error {
            border-color: #d00;
          }

          &:focus {
            border-color: #32aa27;
            outline: none;
          }
        }

        small {
          color: #d00;
          font-size: 13px;
          margin-top: 2px;
        }
      }

      .checkbox {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 14px;
        line-height: 1.4;

        input {
          margin-top: 3px;
        }
      }

      .error-text {
        color: #d00;
        font-size: 14px;
      }

      .success-message {
        color: #32aa27;
        font-size: 15px;
      }

      button {
        background-color: #32aa27;
        color: #fff;
        font-weight: 600;
        font-size: 16px;
        border: none;
        padding: 10px 25px;
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background-color: #289320;
        }

        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      }
    }
  }

  .contact-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .info-box {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      padding: 20px;
      border-radius: 0px;
      font-size: 15px;
      color: #333;

      h3 {
        margin: 10px 0 6px;
        color: #32aa27;
      }

      a {
        color: #32aa27;
        text-decoration: none;
      }

      p {
        margin: 4px 0;
      }
    }
  }
}
</style>
