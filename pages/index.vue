<template>
  <div class="container">
    <app-banner />
    <about-us />
    <products-categories />
    <contact-section />
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Tiplast.pl – Produkcja i sprzedaż doniczek z tworzyw sztucznych',
  description: 'Produkcja i sprzedaż wysokiej jakości doniczek z tworzyw sztucznych.Usługi wtryskowe w województwie kujawsko-pomorskiem. Jesteśmy na rynku od 2015 roku.',
  
  // Open Graph (Facebook, LinkedIn)
  ogTitle: 'tiplast.pl',
  ogDescription: 'Produkcja i dystrybucja doniczek i innych produktów z tworzyw sztucznych. Usługi wtryskowe w województwie kujawsko-pomorskiem.',
  ogImage: 'https://tiplast.pl/og-image.webp',
  ogUrl: 'https://tiplast.pl',

  // Twitter (czasem Google też używa)
  twitterCard: 'summary_large_image'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Tiplast",
        url: "https://tiplast.pl",
        logo: "https://tiplast.pl/logo.png"
      })
    }
  ]
})
</script>
