<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-col col-1">
        <h3><v-img cover src="/images/logo_green.svg" class="img"></v-img></h3>
        <p>
          TIPLAST to producent wysokiej jakości plastikowych doniczek i mis
          dekoracyjnych. Nasze produkty powstają by zaspokoić wasze oczekiwania.
        </p>
      </div>

      <div class="footer-col">
        <h3>Menu</h3>
        <ul>
          <li>
            <NuxtLink href="/">Strona główna</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/produkty">Nasze produkty</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/kontakt">O nas</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Informacje</h3>
        <ul>
          <li>
            <NuxtLink href="/polityka-prywatnosci">Polityka prywatości</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/polityka-cookies">Polityka Cookies</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/warunki-korzystania">Warunki Korzystania</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/faq">FAQ</NuxtLink>
          </li>
          <li @click="showSettings = true"><p class="link" >Zarządzaj ciasteczkami</p></li>
        </ul>
      </div>

      <!-- Kolumna 3 -->
      <div class="footer-col">
        <h3>Kontakt</h3>
        <ul>
          <li>
            <strong>Email: </strong>
            <a href="mailto:kontakt.tiplast@gmail.com">kontakt.tiplast@gmail.com</a>
          </li>
          <li>
            <strong>Telefon: </strong>
            <a href="tel:+48608467068">+48 608 467 068</a>
          </li>
          <li>
            <strong>Adres:<br /></strong> Papowo Biskupie 31,<br />86-221,
            Polska
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2025 TIPLAST. Wszelkie prawa zastrzeżone.</p>
    </div>
    <CookiesManager v-if="showSettings" @close="showSettings = false" />
  </footer>
</template>

<script setup>
const showSettings = ref(false)
</script>

<style scoped lang="scss">
.footer {
  background: #1c1c1c;
  color: #eee;
  font-size: 15px;
  padding: 50px 20px 20px;
  margin-top: 80px;

  .footer-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    max-width: 1200px;
    padding: 0px 24px;
    margin: 0 auto;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      gap: 60px;
    }

    .footer-col {
      flex: 1;

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #32aa27;
        margin-bottom: 15px;
      }

      p {
        line-height: 1.6;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 8px;

          a , .link{
            color: #eee;
            text-decoration: none;
            transition: color 0.3s;
            cursor: pointer;

            &:hover {
              color: #32aa27;
            }
          }
        }
      }
    }

    .col-1 {
      flex: 2;
    }
  }

  .footer-bottom {
    border-top: 1px solid #333;
    text-align: center;
    margin-top: 40px;
    padding-top: 15px;
    font-size: 14px;
    color: #aaa;
  }
}

.img {
  width: 120px;
}
</style>
