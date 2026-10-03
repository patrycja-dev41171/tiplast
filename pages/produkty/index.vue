<template>
  <ProductsCatalog
    :categories="categories"
    :products="products"
    :colors="colors"
    heading="Wszystkie produkty"
  />
</template>

<script setup>
const { categories, products, colors } = await useCatalog();

const seoTitle = "Doniczki produkcyjne i misy do kwiatów – sklep producenta | tiplast.pl";
const seoDescription = "Wszystkie produkty TIPLAST: doniczki produkcyjne, misy do kwiatów, misy wiszące, misy do chryzantem i stroików. Polski producent, sprzedaż detaliczna i hurtowa, wysyłka w 24 h.";
const ogImage = "https://tiplast.pl/images/og-image.webp";

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: "website",
  ogUrl: "https://tiplast.pl/produkty",
  ogImage: ogImage,
  twitterCard: "summary_large_image",
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: ogImage,
});

useHead({
  link: [{ rel: "canonical", href: "https://tiplast.pl/produkty" }],
});
</script>
