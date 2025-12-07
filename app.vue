<template>
  <NuxtLayout>
      <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
  <noscript>
    <iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-K8S3MXF5"
      height="0"
      width="0"
      style="display:none;visibility:hidden">
    </iframe>
  </noscript>
  </ClientOnly>
</template>

<script setup>
useHead({
  htmlAttrs: {
    lang: 'pl'
  },
  meta: [
    {
      name: "publisher",
      content: "Tiplast"
    },
    {
      property: "article:publisher",
      content: "https://www.facebook.com/people/Tiplast/100088947168990/"
    }
  ]
})
</script>