<script setup>
definePageMeta({
  layout: "default"
})

const faqMisy = [
  {
    question: "Czy misy do kwiatów nadają się na balkon?",
    answer: "Tak, są lekkie i nie obciążają konstrukcji balkonu."
  },
  {
    question: "Jaką średnicę misy wybrać?",
    answer: "Do małych roślin 21 cm, do większych 23–25 cm."
  },
  {
    question: "Czy misy posiadają otwory odpływowe?",
    answer: "Tak, większość modeli posiada otwory drenażowe."
  },
  {
    question: "Czy można używać ich we wnętrzach?",
    answer: "Tak, są idealne również jako dekoracyjne donice domowe."
  }
];

const slug = "misy-do-kwiatow"

const { getCategoryBySlug } = useCategories(slug)
const { getProductsByCategory } = useProducts()

const [category] = await getCategoryBySlug(slug)
if (!category) {
  throw createError({ statusCode: 404, statusMessage: "Kategoria nie istnieje" })
}

const products = await getProductsByCategory(category.id)

console.log(products)


useHead({
  title: "Misy do kwiatów – donice ogrodowe i balkonowe | tiplast.pl",
  meta: [
    {
      name: "description",
      content:
        "Misy do kwiatów, miski do chryzantem w różnych rozmiarach i kolorach. Idealne do ogrodu, domu i na balkon. Trwałe, polski producent."
    },
    {
      name: "keywords",
      content:
        "misy do kwiatów, misy ogrodowe, miski do chryzantem, donice plastikowe, donice ogrodowe, donice balkonowe"
    },
    { name: "robots", content: "index, follow" },

    { property: "og:title", content: "Tiplast.pl - misy do kwiatów, chryzantem." },
    {
      property: "og:description",
      content:
        "Polski producent doniczek do kwiatów. Misy kwiatowe idealne do ogrodu, domu i na balkon."
    },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: `https://tiplast.pl/kategoria/${slug}`
    },
    {
      property: "og:image",
      content: "https://tiplast.pl/images/og-image.webp"
    },

    // Twitter Cards
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Misy do kwiatów – Tiplast" },
    {
      name: "twitter:description",
      content:
        "Misy do kwiatów od polskiego producenta. Idealne na balkon, taras oraz do ogrodu."
    },
    {
      name: "twitter:image",
      content: "https://tiplast.pl/images/og-image.webp"
    }
  ],
  link: [
    {
      rel: "canonical",
      href: `https://tiplast.pl/kategoria/${slug}`
    }
  ],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: category.display_name,
        description:
          "Misy do kwiatów, miski do chryzantem w różnych rozmiarach i kolorach. Idealne do ogrodu, domu i na balkon. Trwałe, polski producent.",
        url: `https://tiplast.pl/kategoria/${slug}`,
        image: `https://tiplast.pl/kategoria/${slug}`,
        mainEntity: products.map((p, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            "@id": `https://tiplast.pl/produkt/${p.url}#product`,
            name: p.display_name,
            description: p.description,
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
              price: p.prices.pln.base_price || 0,
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

    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqMisy.map((f) => ({
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
  <PageMisy :products="products" :faqMisy="faqMisy" />
</template>
