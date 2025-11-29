<script setup>
definePageMeta({
  layout: "default"
})

const faqMisy = [
   {question: "Czy te misy nadają się do chryzantem?",
    answer: "Tak. Misa 21 cm i 25 cm będzie do tego idealna. Chryzantema trio, tricolor, trzykolorowana będzie świetnie rosnąć w misie fi 25 cm."
  },
  {
    question: "Z jakiego materiału wykonane są plastikowe doniczki?",
    answer: "Większość plastikowych mis i doniczek produkowana jest z polipropylenu (PP), który cechuje się dużą trwałością, lekkością oraz odpornością na pęknięcia i działanie warunków atmosferycznych."
  },
  {
    question: "Czy plastikowe doniczki nadają się do użytku na zewnątrz?",
    answer: "Tak, doniczki z wysokiej jakości tworzywa są odporne na deszcz, wilgoć i promieniowanie UV."
  },
  {
    question: "Czy doniczki mają otwory drenażowe?",
    answer: "Powysze doniczki posiadają otwory drenażowe. Otwory pozwalają na odpływ nadmiaru wody i chronią korzenie przed gniciem."
  },
];

const slug = "misy-do-kwiatow"

const { getCategoryBySlug } = useCategories(slug)
const { getProductsByCategory } = useProducts()

const [category] = await getCategoryBySlug(slug)
if (!category) {
  throw createError({ statusCode: 404, statusMessage: "Kategoria nie istnieje" })
}

const products = await getProductsByCategory(category.id)

const title = "Misy do kwiatów – donice ogrodowe i balkonowe | tiplast.pl";
const url = `https://tiplast.pl/kategoria/${slug}`;
const ogImage = "https://tiplast.pl/images/og-image.webp"
const description = "Misy do kwiatów, miski do chryzantem w różnych rozmiarach i kolorach. Idealne do ogrodu, domu i na balkon. Trwałe, polski producent."

useHead({
  title: title,
  meta: [
    {
      name: "description",
      content: description
    },
    {
      name: "keywords",
      content:
        "misy do kwiatów, misy ogrodowe, miski do chryzantem, donice plastikowe, donice ogrodowe, donice balkonowe"
    },
    { name: "robots", content: "index, follow" },

    { property: "og:title", content: title },
    {
      property: "og:description",
      content: description
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
      content: description
    },
    {
      name: "twitter:image",
      content: ogImage
    },
  ],
  link: [
    {
      rel: "canonical",
      href: url
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
