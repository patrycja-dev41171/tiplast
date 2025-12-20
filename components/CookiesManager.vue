<template>
  <div class="wrapper">
    <div class="banner glass-card">
      <h4 class="mb-2">Twoja prywatność</h4>
      <p class="mb-2">Poniżej możesz dostosować ustawienia plików cookie, zarówno dla naszych plików cookie, jak i plików cookie
        naszych partnerów. Potrzebujemy Twojej zgody na używanie plików cookie analitycznych i marketingowych.</p>
      <p class="mb-2">Jeśli chcesz zaakceptować wszystkie pliki cookie, kliknij „Akceptuję wszystkie”. Jeśli wolisz, abyśmy używali
        tylko niezbędnych plików cookie, wybierz „Zapisz wybór”. Aby zmienić preferencje dotyczące plików
        cookie, przesuń suwak obok odpowiedniej kategorii. Masz prawo do przeglądania i modyfikowania swoich ustawień w
        dowolnym momencie.</p>
      <p class="mb-4">Korzystanie z plików cookie wiąże się z przetwarzaniem Twoich danych osobowych związanych z aktywnością na
        stronie internetowej. Szczegółowe informacje o tym, jak my i nasi partnerzy wykorzystujemy pliki cookie i
        przetwarzamy Twoje dane, a także informacje o Twoich prawach, znajdziesz w naszej <NuxtLink class="link" href="/polityka-cookies" @click="emit('close')">polityce plików cookie</NuxtLink>.</p>
      
      <h4 class="mb-2">Zarządzaj ciasteczkami</h4>
        <div class="switches">
        <div class="switch">
          <input type="checkbox" checked disabled />
          <span>Obowiązkowe</span>
        </div>

        <div class="switch">
          <input type="checkbox" v-model="functional" />
          <span>Funkcjonalne</span>
        </div>

        <div class="switch">
          <input type="checkbox" v-model="analytics" />
          <span>Analityczne</span>
        </div>

      </div>

      <div class="buttons">
        <button class="less-visible" @click="save">
          Zapisz wybór
        </button>
        <button @click="acceptAll">
          Akceptuję wszystkie
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close'])

const consent = useCookie('cookies_consent', {
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax',
})

// inicjalizacja ze stanu cookie (jeśli user wróci)
const functional = ref(consent.value?.cookies?.includes('functional'))
const analytics = ref(consent.value?.cookies?.includes('analytics'))

const save = () => {
  const cookies = ['mandatory']

  if (functional.value) cookies.push('functional')
  if (analytics.value) cookies.push('analytics')

  consent.value = {
    accepted: true,
    cookies,
  }

  emit('close')
}

const acceptAll = () => {
  consent.value = {
    accepted: true,
    cookies: ['mandatory', 'functional', 'analytics'],
  }

  emit('close')
}


</script>

<style lang="scss" scoped>
/* wrapper i glass-card IDENTYCZNE jak w pierwszym bannerze */

.wrapper {
  position: fixed;
  inset: 0;
  background: rgba(20, 15, 40, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 9998;
}

.banner {
  padding: 20px;
  width: 90%;
  margin: auto;
  max-width: 850px;
  position: fixed;
  max-height: 90vh;
  overflow: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;

  @include md {
    padding: 30px;
  }

  h4 {
    font-size: 17px;

    @include md {
      font-size: 19px;
    }
  }
}

.glass-card {
  background: linear-gradient(135deg,
      rgba(17, 190, 20, 0.399),
      rgba(32, 234, 157, 0.316));
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 18px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    inset 0 0 0.5px rgba(255, 255, 255, 0.6);
}

/* 🔘 Switche */

.switches {
  display: flex;
  flex-direction: column;
  gap: 14px;

  @include sm {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.switch {
  display: flex;
  align-items: center;
  gap: 12px;

  input {
    width: 42px;
    height: 20px;
    appearance: none;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 20px;
    position: relative;
    cursor: pointer;
    transition: .3s;
  }

  input::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: .3s;
  }

  input:checked {
    background: rgba(32, 234, 157, 0.8);
  }

  input:checked::before {
    transform: translateX(20px);
  }

  input:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;

  button {
    background: linear-gradient(135deg,
        rgba(17, 190, 20, 0.526),
        rgba(32, 234, 157, 0.464));
    margin-left: 5px;
    padding: 8px 19px;
    border-radius: 50px;
    font-size: 14.5px;
    cursor: pointer;

    @include md {
      margin-left: 10px;
      padding: 8px 24px;
      font-size: 16px;
    }
  }

  .less-visible {
    background: linear-gradient(135deg,
        #11be141f,
        rgba(32, 234, 157, 0.231));
    margin-left: 0px;
  }
}

.link {
  color: hsl(121, 84%, 41%);
}
</style>
