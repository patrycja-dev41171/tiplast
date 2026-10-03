<template>
  <ProductsCatalog
    :categories="categories"
    :products="categoryProducts"
    :colors="colors"
    :activeSlug="category.slug"
    :heading="content.heading"
    :subheading="content.subheading"
    :intro="content.intro"
    :sections="content.sections"
    :faq="content.faq"
  />
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;

const { categories, products, colors } = await useCatalog();

const category = categories.value.find((c) => c.slug === slug);

if (!category) {
  throw createError({ statusCode: 404, statusMessage: "Nie znaleziono kategorii", fatal: true });
}

const categoryProducts = computed(() =>
  products.value.filter((p) => p.categories?.map(Number).includes(category.id))
);

const content = getCategoryContent(category);
const url = `https://tiplast.pl/produkty/${category.slug}`;
const ogImage = "https://tiplast.pl/images/og-image.webp";

useSeoMeta({
  title: content.title,
  description: content.description,
  ogTitle: content.title,
  ogDescription: content.description,
  ogType: "website",
  ogUrl: url,
  ogImage: ogImage,
  twitterCard: "summary_large_image",
  twitterTitle: content.title,
  twitterDescription: content.description,
  twitterImage: ogImage,
});

const toPrice = (value) => Number((value || "0").toString().replace(",", "."));

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: content.heading,
    description: content.description,
    url: url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categoryProducts.value.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          "@id": `https://tiplast.pl/produkt/${p.url}#product`,
          name: p.display_name,
          sku: p.sku,
          url: `https://tiplast.pl/produkt/${p.url}`,
          image: p.photos?.map((photo) => photo.url) || [],
          brand: { "@type": "Brand", name: "Tiplast" },
          offers: {
            "@type": "Offer",
            price: toPrice(p.prices?.pln?.base_price),
            priceCurrency: "PLN",
            availability: "https://schema.org/InStock",
            url: `https://tiplast.pl/produkt/${p.url}`,
          },
        },
      })),
    },
  },
];

if (content.faq.length) {
  jsonLd.push({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  });
}

useHead({
  link: [{ rel: "canonical", href: url }],
  script: jsonLd.map((data) => ({
    type: "application/ld+json",
    children: JSON.stringify(data),
  })),
});
</script>
