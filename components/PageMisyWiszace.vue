<template>
  <div class="category-page">
    <h1 class="title">Misy wiszące do kwiatów</h1>

    <h2 class="mb-4 mt-2">
      Misy wiszące – idealne donice balkonowe i ogrodowe do efektownych kompozycji roślinnych
    </h2>

    <p class="mb-4">
      Misy wiszące to doskonały wybór dla osób, które chcą w efektowny sposób wyeksponować rośliny 
      na balkonie, tarasie lub w ogrodzie. Dzięki solidnym hakom i wytrzymałej konstrukcji 
      świetnie sprawdzają się podczas uprawy roślin zwisających, takich jak surfinie, pelargonie, 
      begonie, truskawki, petunie czy plecione kompozycje sezonowe.
    </p>

    <p class="mb-12">
      Ich głęboki kształt umożliwia prawidłowy rozwój systemu korzeniowego, a odpowiedni balans 
      między szerokością a wysokością wpływa na stabilność roślin. Wykonane z trwałego polipropylenu 
      misy są odporne na warunki atmosferyczne i promieniowanie UV, dzięki czemu zachowują kolor 
      oraz wygląd przez wiele sezonów.
    </p>

    <div v-if="products.length === 0">
      Brak produktów w tej kategorii.
    </div>

    <product-list :products="products" />

    <h2 class="mt-10 mb-2">Do jakich roślin najlepiej nadają się misy wiszące?</h2>

    <p class="mb-2">
     Misy wiszące doskonale pasują do roślin zwisających oraz takich, które tworzą okazałe, kaskadowe kompozycje. Najlepiej sprawdzają się w nich pelargonie bluszczolistne, surfinie, petunie, bidensy, bakopy, lobelie czy komarzyce. Rośliny te swobodnie opadają po bokach, tworząc dekoracyjne, gęste kaskady.
    </p>
    <p class="mb-2">
     To także świetne rozwiązanie dla roślin zielonych — bluszczu, zielistki czy paproci — które dobrze rosną w pojemnikach wiszących i pięknie prezentują się w przestrzeniach zacienionych.
    </p>
    <p class="mb-2">
     Misy wiszące są idealnym wyborem, jeśli chcesz uzyskać efekt „wiszącego ogrodu” nawet na niewielkim balkonie.
    </p>
    <h2 class="mb-6 mt-12">FAQ - Najczęściej zadawane pytania</h2>
    <FaqList :items="faq" />
  </div>
</template>

<script setup>
const props = defineProps({
  products: Array,
  faq: Array
});
</script>

<style scoped>
.title {
  color: #32aa27;
}

.category-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: #fff;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
