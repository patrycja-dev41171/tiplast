<template>
  <section v-if="bestsellers.length" class="bestsellers">
    <div class="header">
      <h4>Najczęściej wybierane</h4>
      <h3>Nasze bestsellery</h3>
    </div>

    <div
      class="slider-wrap"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
      @focusin="paused = true"
      @focusout="paused = false"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <button class="arrow arrow-prev" aria-label="Poprzednie produkty" @click="prev">
        <v-icon icon="mdi-chevron-left" size="40" />
      </button>

      <div class="viewport">
        <div
          class="track"
          :class="{ 'no-transition': !animate }"
          :style="{ '--i': index }"
          @transitionend.self="onTransitionEnd"
        >
          <div v-for="(p, i) in slides" :key="`${p.id}-${i}`" class="slide">
            <product-card :product="p" />
          </div>
        </div>
      </div>

      <button class="arrow arrow-next" aria-label="Następne produkty" @click="next">
        <v-icon icon="mdi-chevron-right" size="40" />
      </button>
    </div>
  </section>
</template>

<script setup>
const AUTOPLAY_MS = 3500;
const MAX_PER_VIEW = 4; // tyle kopii początku listy dokładamy na końcu, żeby pętla była niewidoczna

const { products } = await useCatalog();

const bestsellers = ref(
  BESTSELLER_SKUS.map((sku) => products.value.find((p) => p.sku === sku)).filter(Boolean)
);

const slides = computed(() => [
  ...bestsellers.value,
  ...bestsellers.value.slice(0, MAX_PER_VIEW),
]);

const index = ref(0);
const animate = ref(true);
const paused = ref(false);
let timer = null;
let touchX = 0;

// Losowa kolejność tylko po stronie klienta, żeby uniknąć różnic między SSR a hydratacją
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const next = () => {
  animate.value = true;
  index.value++;
};

const prev = async () => {
  if (index.value === 0) {
    // skok bez animacji na kopię na końcu, potem animowany krok wstecz
    animate.value = false;
    index.value = bestsellers.value.length;
    await nextTick();
    void document.querySelector(".bestsellers .track")?.offsetWidth;
  }
  animate.value = true;
  index.value--;
};

const onTransitionEnd = () => {
  if (index.value >= bestsellers.value.length) {
    animate.value = false;
    index.value -= bestsellers.value.length;
  }
};

const onTouchStart = (e) => {
  paused.value = true;
  touchX = e.changedTouches[0].clientX;
};

const onTouchEnd = (e) => {
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  paused.value = false;
};

onMounted(() => {
  bestsellers.value = shuffle(bestsellers.value);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  timer = setInterval(() => {
    if (!paused.value) next();
  }, AUTOPLAY_MS);
});

onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped lang="scss">
.bestsellers {
  max-width: 1200px;
  width: 100%;
  margin: 50px auto 00px;
  padding: 24px 24px 0;

  .header {
    margin-bottom: 30px;
    h4 {
      color: #32aa27;
      font-size: 17px;
      text-transform: uppercase;
    }
    h3 {
      margin: 15px 0 0;
      font-size: 26px;
      line-height: 32px;
    }
  }
}

.slider-wrap {
  --gap: 24px;
  --per-view: 1;
  position: relative;

  @media (min-width: 560px) {
    --per-view: 2;
  }
  @media (min-width: 800px) {
    --per-view: 3;
  }
  @media (min-width: 1100px) {
    --per-view: 4;
  }
}

.viewport {
  overflow: hidden;
  // luz na cień i unoszenie karty przy hoverze, żeby overflow ich nie ucinał;
  // ujemny margines zachowuje szerokość sekcji
  padding: 10px 12px 16px;
  margin: -6px -12px 0;
}

.track {
  display: flex;
  gap: var(--gap);
  transition: transform 0.6s ease;
  transform: translateX(calc(-1 * var(--i) * (100% + var(--gap)) / var(--per-view)));

  &.no-transition {
    transition: none;
  }
}

.slide {
  flex: 0 0 calc((100% - (var(--per-view) - 1) * var(--gap)) / var(--per-view));
  min-width: 0;
  display: flex;

  > * {
    width: 100%;
  }
}

.arrow {
  position: absolute;
  top: 130px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background: #fff;
  color: #32aa27;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #32aa27;
    color: #fff;
  }
}

// Strzałki stoją poza sekcją; na węższych ekranach (brak miejsca na bokach)
// siedzą na krawędzi sekcji, w 24px marginesie strony
.arrow {
  width: 44px;
  height: 44px;
}

.arrow-prev {
  left: -22px;
}

.arrow-next {
  right: -22px;
}

@media (min-width: 1360px) {
  .arrow {
    width: 52px;
    height: 52px;
  }
  .arrow-prev {
    left: -76px;
  }
  .arrow-next {
    right: -76px;
  }
}
</style>
