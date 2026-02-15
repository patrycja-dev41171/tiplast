<template>
  <div v-if="loading" class="not-found">Ładowanie produktu...</div>

<Product v-else-if="product" :product="product" />

  <div v-else class="not-found">
    <h2>Nie znaleziono produktu</h2>
  </div>
</template>

<script setup>
import { computed} from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const url = route.params.url

const { getProductByUrl } = useProducts()


const data = await getProductByUrl(url);
const product = computed(() => data)

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
};


const title = product.value?.display_name || "Produkt";
const description = product.value?.short_description || product.value?.display_name;
const og_image = "https://tiplast.pl/images/og-image.webp"

useSeoMeta({
  title: title,
  description: description,
  ogTitle: title,
  ogDescription: description,
  ogImage: og_image,
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: og_image,
});

useHead({
  link: [
    {
      rel: "canonical",
      href: `https://tiplast.pl/produkt/${product.value.url}`,
    },
  ],
   script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.value?.display_name,
        "description": stripHtml(product.value?.description),
        "image": product.value?.photos?.length
          ? product.value.photos.map(p => p.url)
          : ["https://tiplast.pl/images/og-image.webp"],
        "sku": product.value?.sku || product.value?.id || url,
        "brand": {
          "@type": "Brand",
          "name": "Tiplast"
        },
        "additionalProperty":
          product.value?.technical_details?.map((t) => ({
            "@type": "PropertyValue",
            "name": t.name,
            "value": t.value
          })) || [],
        "offers": {
          "@type": "Offer",
          "url": `https://tiplast.pl/produkt/${product.value?.url}`,
          "priceCurrency": "PLN",
           "price": Number(
                (product.value?.prices?.pln?.base_price || '0').toString().replace(',', '.')
              ),
          "availability": product?.value?.stock?.quantity > 0 ? "http://schema.org/InStock" : "http://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Tiplast",
          "url": "https://tiplast.pl"
        }
      })
    }
  ]
});


</script>

<style scoped lang="scss">

.product-page {
  max-width: 1100px;
  margin: 30px auto 100px;

  .product-header {
    display: flex;
    flex-direction: column;
    gap: 40px;

    @media (min-width: 768px) {
      flex-direction: row;
    }
  }

  @media (min-width: 768px) {
    margin: 50px auto 100px;
  }

  /* --- GALERIA --- */
  .gallery {
    max-width: 620px;
    width: 100%;
    max-height: 500px !important;
    @include md {
      max-height: 700px !important;
    }

    .main-photo {
      width: 100%;
      max-height: 400px !important;
      height: 400px;
      object-fit: cover;
      border: 1px solid #e0e0e0;
      @include md {
        max-height: 500px !important;
        height: 500px;
      }
    }

    .thumbnails {
      display: flex;
      gap: 10px;
      margin-top: 12px;
      overflow-x: auto;
      padding-bottom: 10px;

      img {
        width: 70px;
        min-width: 70px;
        height: 70px;
        object-fit: cover;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        transition: border 0.2s;

        &:hover {
          border-color: #32aa27;
        }

        &.active {
          border-color: #32aa27;
        }
      }
    }
  }

  .product-info {
    flex: 1;

    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }

    .price {
      font-size: 22px;
      font-weight: 600;
      color: #32aa27;
      margin-bottom: 20px;
    }

    .technical {
      h3 {
        margin-bottom: 5px;
        font-size: 18px;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          padding: 4px 0;
          font-size: 15px;
        }
      }
    }
  }
}

/* --- TABS --- */
.tabs {
  margin: 40px 0;
  display: flex;
  gap: 40px;
  border-bottom: 2px solid #e0e0e0;
  justify-content: flex-start;
  flex-wrap: wrap; // ⬅️ pozwala łamać wiersze na mobilu

  button {
    background: none;
    border: none;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    padding: 6px 0;
    cursor: pointer;
    color: #666;
    border-bottom: 3px solid transparent;
    transition: all 0.3s;
    white-space: nowrap;

    &.active {
      color: #32aa27;
      border-color: #32aa27;
    }

    &:hover {
      color: #32aa27;
    }
  }

  /* --- Styl mobilny --- */
  @media (max-width: 768px) {
    margin: 20px 0;
    flex-direction: column; // ⬅️ zakładki jedna pod drugą
    align-items: stretch;
    gap: 10px;
    border-bottom: none; // usuwamy linię pod spodem

    button {
      width: 100%;
      border: 1px solid #e0e0e0;
      padding: 8px;
      font-size: 14px;
      text-align: center;
      background: #f9f9f9;
      letter-spacing: 0.8px;
      transition: all 0.2s;

      &.active {
        background: #32aa27;
        color: #fff;
        border-color: #32aa27;
      }

      &:hover {
        background: #32aa27;
        color: #fff;
        border-color: #32aa27;
      }
    }
  }
}

/* --- TREŚĆ --- */
.tab-content {
  font-size: 16px;
  color: #333;
  line-height: 1.6;

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    padding: 5px 0;
  }
}

.not-found {
  text-align: center;
  padding: 100px 0;
}
</style>
