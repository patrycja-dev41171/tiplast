<template>
  <NuxtLayout name="default">
    <section class="error-page px-6">
      <div class="hero">
        <img class="logo" src="/images/logo_black.svg" alt="Tiplast" />

        <p class="eyebrow">{{ is404 ? "Błąd 404" : `Błąd ${statusCode}` }}</p>
        <h1>{{ heading }}</h1>
        <p class="lead">{{ message }}</p>

        <div class="actions">
          <v-btn size="x-large" color="#32aa27" class="btn" @click="goTo('/produkty')">
            Zobacz produkty
          </v-btn>
          <v-btn size="x-large" variant="outlined" color="#32aa27" class="btn" @click="goTo('/')">
            Strona główna
          </v-btn>
        </div>
      </div>

      <div v-if="is404" class="categories">
        <h2>Może szukasz jednej z tych kategorii?</h2>
        <div class="category-grid">
          <a
            v-for="category in categories"
            :key="category.to"
            :href="category.to"
            class="category"
            @click.prevent="goTo(category.to)"
          >
            <img :src="category.image" :alt="category.name" loading="lazy" />
            <span>{{ category.name }}</span>
          </a>
        </div>
      </div>

      <p class="error-contact">
        Nie możesz czegoś znaleźć? Zadzwoń:
        <a href="tel:+48608467068">+48 608 467 068</a>
        lub napisz:
        <a href="mailto:kontakt.tiplast@gmail.com">kontakt.tiplast@gmail.com</a>
      </p>
    </section>
  </NuxtLayout>
</template>

<script setup>
const props = defineProps({
  error: Object,
});

const statusCode = computed(() => props.error?.statusCode || 500);
const is404 = computed(() => statusCode.value === 404);

const heading = computed(() =>
  is404.value ? "Ups! Ta doniczka jest pusta" : "Coś poszło nie tak"
);

const message = computed(() =>
  is404.value
    ? "Strona, której szukasz, nie istnieje lub została przeniesiona. Sprawdź nasze produkty albo wróć na stronę główną."
    : "Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę za chwilę lub skontaktuj się z nami."
);

const categories = [
  { name: "Doniczki produkcyjne", to: "/produkty/doniczki", image: "/images/categories/doniczki-produkcyjne.png" },
  { name: "Misy do kwiatów", to: "/produkty/misy-do-kwiatow", image: "/images/categories/misa.webp" },
  { name: "Misy wiszące", to: "/produkty/misy-wiszace", image: "/images/categories/misa-wiszaca.jpeg" },
];

const goTo = (path) => clearError({ redirect: path });

useHead({
  title: computed(() => (is404.value ? "Nie znaleziono strony | tiplast.pl" : "Błąd serwera | tiplast.pl")),
  meta: [{ name: "robots", content: "noindex, follow" }],
});
</script>

<style scoped lang="scss">
.error-page {
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 60px;
  padding-bottom: 80px;
  text-align: center;
  font-family: $roboto;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 200px;
  height: auto;
  margin-bottom: 32px;

  @include md {
    width: 260px;
  }
}

.eyebrow {
  color: $green;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 14px;
  margin-bottom: 8px;
}

h1 {
  font-size: 28px;
  color: #222;
  margin-bottom: 12px;

  @include md {
    font-size: 36px;
  }
}

.lead {
  max-width: 520px;
  color: $soft-black;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 28px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;

  @include sm {
    flex-direction: row;
    justify-content: center;
    max-width: none;
  }

  .btn {
    width: 100%;

    @include sm {
      width: 240px;
    }
  }
}

.categories {
  margin-top: 70px;

  h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 24px;
  }
}

.category-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @include sm {
    grid-template-columns: repeat(3, 1fr);
  }
}

.category {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background: $white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  color: #222;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  }

  img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  span {
    padding: 14px;
    font-weight: 600;
  }
}

.error-contact {
  margin-top: 50px;
  color: $soft-black;
  font-size: 15px;
  line-height: 1.7;

  a {
    color: $green;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }
}
</style>
