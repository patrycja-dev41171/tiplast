<template>
    <AppContainer>
        <h1 class="mt-12 mb-8 title">FAQ - Najczęściej zadawane pytania</h1>
        <FaqList :items="faq" />
    </AppContainer>
</template>

<script setup>
const faq = [
    {
        question: "Czy plastikowe doniczki są bezpieczne dla roślin?",
        answer: "Tak, są całkowicie bezpieczne. Polipropylen nie wchodzi w reakcję z podłożem ani wodą, dzięki czemu nie wpływa negatywnie na rozwój roślin."
    },
    {
        question: "Czy plastikowe doniczki są ekologiczne?",
        answer: "Plastikowe doniczki nadają się do recyklingu, a wiele z nich produkowanych jest już z materiałów ponownie przetworzonych. Są również bardzo trwałe, więc mogą służyć przez wiele sezonów."
    },
    {
        question: "Jak czyścić plastikowe doniczki?",
        answer: "Wystarczy ciepła woda z delikatnym detergentem. W przypadku glonów lub zabrudzeń po ziemi sprawdza się roztwór wody z octem lub delikatne szczotkowanie."
    },
    {
        question: "Czy plastikowe doniczki są odporne na mróz?",
        answer: "Większość modeli jest odporna na temperatury ujemne, ale warto upewnić się w opisie produktu. Doniczki z cienkiego plastiku mogą pękać przy silnym mrozie."
    },
    {
        question: "Jak dobrać rozmiar plastikowej doniczki?",
        answer: "Roślina powinna mieć około 2–5 cm wolnej przestrzeni między bryłą korzeniową a ścianą doniczki. W przypadku szybko rosnących roślin warto wybrać nieco większy model."
    },
    {
        question: "Czy plastikowe doniczki są lekkie?",
        answer: "Tak, są znacznie lżejsze od ceramicznych czy betonowych, dzięki czemu łatwiej je przenosić i ustawiać, nawet w dużych rozmiarach."
    },
    {
        question: "Czy plastikowe doniczki występują w różnych kolorach i kształtach?",
        answer: "Tak, dostępna jest szeroka gama kolorów, wzorów i form – od klasycznych mis po nowoczesne donice dekoracyjne. Dzięki temu łatwo dopasować je do każdego wnętrza lub ogrodu. </br></br> <strong>Cała nasza oferta znajduje się tutaj: </strong>"
    }
]

const title = "FAQ - Najczęściej zadawane pytania | tiplast.pl";
const url = "https://tiplast.pl/faq";
const ogImage = "https://tiplast.pl/images/og-image.webp"
const description = "FAQ - Najczęściej zadawane pytania dotyczące mis do kwiatów, mis do chryzantem, doniczek produktyjnych na rozsady, mis do stroików."

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
                "faq, najczęściej zadawane pytania, misy do kwiatów, misy ogrodowe, miski do chryzantem, donice plastikowe, donice ogrodowe, donice balkonowe"
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

<style scoped lang="scss">

.title {
font-size: 24px;
}
</style>