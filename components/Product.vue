<template>
  <div v-if="product" class="product-page pa-6">
    <div class="product-header">
      <!-- Galeria -->
      <div class="gallery">
        <img :src="activePhoto.url" :alt="activePhoto.alt" class="main-photo" />

        <div class="thumbnails">
          <img v-for="(photo, i) in product.photos" :key="i" :src="photo.url" :alt="photo.alt"
            :class="{ active: i === activeIndex }" @click="activeIndex = i" />
        </div>
      </div>

      <!-- Info -->
      <div class="product-info">
        <h1>{{ product.display_name }}</h1>
        <div class="d-none d-md-flex flex-column technical mt-6" v-if="product.technical_details?.length">
          <ul>
            <li v-for="(item, i) in product.technical_details" :key="i">
              <strong>{{ item.name }}:</strong> {{ item.value }}
            </li>
          </ul>
        </div>
        <p class="price mt-6">
          Cena: {{ product.prices.pln.base_price }}
          {{ product.prices.pln.symbol }}
        </p>
        <AddToCart :product-id="product.id" :max="product.stock.quantity" :product-price="product.prices.pln.base_price" @added="onAdded" />
      </div>
    </div>

    <!-- ZAKŁADKI -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.value" :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value">
        {{ tab.label }}
      </button>
    </div>

    <!-- TREŚĆ ZAKŁADEK -->
    <div class="tab-content">
      <div v-if="activeTab === 'description'">
        <ProductDescription :description="product.description" />
      </div>

      <div v-else-if="activeTab === 'technical'">
        <div v-if="product.technical_details?.length">
          <h3>Parametry</h3>
          <ul>
            <li v-for="(item, i) in product.technical_details" :key="i">
              <strong>{{ item.name }}:</strong> {{ item.value }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>Brak danych technicznych.</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'delivery'">
        <div v-if="product.delivery_description">
          <div v-html="product.delivery_description"></div>
        </div>
        <div v-else>
          <p>Informacje o dostawie będą dostępne wkrótce.</p>
        </div>
      </div>
      <div v-else-if="activeTab === 'buy'">
        <ProductInquiryForm :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const { product } = defineProps({
  product: {
    type: Object,
    required: true,
  },
});


console.log(product)

const activeIndex = ref(0);
const activePhoto = computed(() => product?.photos?.[activeIndex.value]);

const tabs = [
  { label: "Opis Produktu", value: "description" },
  { label: "Parametry", value: "technical" },
  { label: "Dostawa", value: "delivery" },
  { label: "Jestem zainteresowany", value: "buy" },
];

const activeTab = ref("description");

const onAdded = () => {
  console.log('dodane')
}

</script>

<style lang="scss">
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
</style>
