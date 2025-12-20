import { CookieManager } from '../.nuxt/components';
<template>
  <div class="wrapper">
    <div class="banner glass-card">
      <h4>Używamy ciasteczek</h4>
      <p>Na naszej stronie wykorzystujemy pliki cookie w celach analitycznych, marketingowych i statystycznych.
        Umożliwiają one lepsze dopasowanie treści do Twoich potrzeb. Możesz zaakceptować wszystkie ciasteczka, odrzucić
        je lub dostosować swoje wybory. Dowiedz się więcej w naszej Polityce Prywatności.</p>
      <div class="buttons">
        <button class="less-visible" @click="showSettings = true">Ustawienia</button>
        <button @click="acceptAll">Akceptuję wszystkie</button>
      </div>
    </div>
  </div>
  <CookiesManager v-if="showSettings" @close="showSettings = false" />
</template>

<script setup>

const showSettings = ref(false)

const consent = useCookie('cookies_consent', {
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax',
})

const acceptAll = () => {
  consent.value = {
    accepted: true,
    cookies: ['mandatory', 'functional', 'analytics'],
  }
}


</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  inset: 0;
  background: rgba(20, 15, 40, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 9998;
}

.banner {
  padding: 30px;
  width: 90%;
  margin: auto;
  max-width: 850px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;

  h4 {
    font-size: 19px;
    margin-bottom: 10px;
  }
}

.glass-card {
  background: linear-gradient(135deg,
      rgba(17, 190, 20, 0.399),
      rgba(32, 234, 157, 0.316));
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.18);

  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    inset 0 0 0.5px rgba(255, 255, 255, 0.6);
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;

  button {
    background: linear-gradient(135deg,
        rgba(17, 190, 20, 0.526),
        rgba(32, 234, 157, 0.464));
    margin-left: 10px;
    padding: 8px 24px;
    border-radius: 50px;
    cursor: pointer;
    transition: .3s;

    &:hover {
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.18),
        0 8px 32px rgba(0, 0, 0, 0.35);
    }
  }

  .less-visible {
    background: linear-gradient(135deg,
        rgba(17, 190, 20, 0.122),
        rgba(32, 234, 157, 0.231));
  }
}
</style>