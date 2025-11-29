<script setup>
definePageMeta({
  layout: "default"
});

const faq = [
  {
    question: "Czy misy wiszące nadają się na balkon lub taras?",
    answer: "Tak. Misy wiszące idealnie sprawdzą się zarówno na balkonie, tarasie, jak i w ogrodzie. Są lekkie, wytrzymałe i odporne na warunki atmosferyczne."
  },
  {
    question: "Czy misy wiszące mają wkład lub otwory drenażowe?",
    answer: "Większość modeli posiada otwory drenażowe. Dzięki temu nadmiar wody może swobodnie odpływać, chroniąc rośliny przed przelaniem."
  },
  {
    question: "Czy komplet zawiera haki do zawieszenia?",
    answer: "Tak. Wszystkie misy wiszące Tiplast są sprzedawane w komplecie z solidnymi hakami, które pozwalają na bezpieczne zawieszenie donicy."
  },
  {
    question: "Z jakiego materiału wykonane są misy wiszące?",
    answer: "Misy wiszące wykonane są z polipropylenu (PP), który jest trwały, odporny na uszkodzenia oraz działanie promieni UV."
  }
];

const slug = "misy-wiszace";

const { getCategoryBySlug } = useCategories(slug)
const { getProductsByCategory } = useProducts()

const [category] = await getCategoryBySlug(slug)
if (!category) {
  throw createError({ statusCode: 404, statusMessage: "Kategoria nie istnieje" })
}

const products = await getProductsByCategory(category.id)

const title = "Misy wiszące, doniczki wiszące do kwiatów | tiplast.pl";
const url = `https://tiplast.pl/kategoria/${slug}`;
const ogImage = "https://tiplast.pl/images/og-image.webp"
const description = "Misy wiszące do kwiatów – idealne na balkon, taras i do ogrodu. Trwałe, lekkie i odporne na warunki atmosferyczne. Polski producent Tiplast."

// SEO / HEAD
useHead({
  title: title,
  meta: [
    {
      name: "description",
      content: description,
    },
    {
      name: "keywords",
      content:
        "misy wiszące, donice wiszące, doniczki wiszące, misa wisząca, donice balkonowe wiszące, doniczki do kwiatów wiszące"
    },
    { name: "robots", content: "index, follow" },

    { property: "og:title", content: title },
    {
      property: "og:description",
      content:
        description
    },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: url
    },
    {
      property: "og:image",
      content: ogImage
    },

    // Twitter Cards
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    {
      name: "twitter:description",
      content:
        description
    },
    {
      name: "twitter:image",
      content: ogImage
    }
  ],
  link: [
    {
      rel: "canonical",
      href: url
    }
  ],
  script: [
    // Schema – lista produktów
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: category.display_name,
        description:
          description,
        url: url,
        image: url,
        mainEntity: products.map((p, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            "@id": `https://tiplast.pl/produkt/${p.url}#product`,
            name: p.display_name,
            description: scriptHtml(p.description),
            sku: p.sku,
            url: `https://tiplast.pl/produkt/${p.url}`,
            image: p.photos.map(photo => photo.url),

            brand: {
              "@type": "Brand",
              name: "Tiplast"
            },

            additionalProperty: p.technical_details.map(d => ({
              "@type": "PropertyValue",
              name: d.name,
              value: d.value
            })),

            itemCondition: p.technical_details.find(d => d.name === "stan")?.value === "nowy"
              ? "https://schema.org/NewCondition"
              : undefined,

            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              price: Number(
                (p.prices.pln.base_price || '0').toString().replace(',', '.')
              ),
              priceCurrency: "PLN",

              priceValidUntil: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              ).toISOString().split("T")[0],

              url: `https://tiplast.pl/produkt/${p.url}`
            }
          }
        }))
      })
    },

    // Schema FAQ
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer
          }
        }))
      })
    }
  ]
});
</script>

<template>
  <PageMisyWiszace :products="products" :faq="faq" />
</template>
