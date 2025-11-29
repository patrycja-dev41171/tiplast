<template>
    <div class="category-page">
        <h1 color="#32aa27" class="title">Misy do kwiatów</h1>
        <h2 class="mb-4 mt-2">Misy do kwiatów – eleganckie i funkcjonalne pojemniki do domu, ogrodu i na balkon</h2>
        <p class="mb-12">Misy do kwiatów to jedne z najbardziej uniwersalnych i praktycznych pojemników do uprawy roślin
            zarówno w
            domu, jak i na zewnątrz. Dzięki szerokiemu kształtowi i optymalnej głębokości pozwalają roślinom swobodnie
            się rozrastać, a ich systemy korzeniowe mogą prawidłowo się rozwijać. Misy doskonale sprawdzają się podczas
            sadzenia kwiatów sezonowych, rozbudowanych roślin ozdobnych, sukulentów, a nawet kompozycji
            wielopoziomowych.</p>

        <div v-if="products.length === 0">
            Brak produktów w tej kategorii.
        </div>

        <product-list :products="products" />

        <h2 class="mt-10 mb-2">Dlaczego warto wybrać misy do kwiatów Tiplast?</h2>
        <p class="mb-2">W ofercie Tiplast dostępne są lekkie, wytrzymałe i odporne na warunki atmosferyczne misy w kilku
            wariantach
            średnicy: 17cm, 21 cm, 23 cm i 25 cm, zarówno z kołnierzykiem, jak i w wersjach gładkich. Ich konstrukcja
            zapewnia
            stabilność, a jednocześnie nie obciąża podłoża – co jest szczególnie ważne na balkonach i tarasach.
        </p>
        <p class="mb-2">
            Dostępne kolory, takie jak terakota, czerń, biel czy grafit, świetnie pasują do każdego stylu aranżacyjnego.
            Misy można łatwo dopasować do roślin sezonowych: pelargonii, surfinii, stokrotek, begonii czy roślin
            zielonych. To także idealny wybór na kompozycje świąteczne, jesienne lub wiosenne.
        </p>
        <p class="mb-2">Jeśli szukasz trwałych i eleganckich pojemników, które przetrwają wiele sezonów, misy Tiplast
            będą najlepszym
            wyborem.</p>

        <h2 class="mb-6 mt-12">FAQ - Najczęściej zadawane pytania</h2>

        <FaqList :items="faqMisy" title="FAQ – Misy do kwiatów" />
    </div>
</template>

<script setup>
const props = defineProps({
    products: Array,
    faqMisy: Array
})
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
