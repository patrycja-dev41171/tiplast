<template>
  <section class="legal-page">
    <h1>Polityka plików cookies</h1>
    <p>
      Strona internetowa <strong>tiplast.pl</strong> wykorzystuje pliki cookies
      w celu zapewnienia prawidłowego działania serwisu, zapamiętywania ustawień
      użytkownika oraz – po wyrażeniu zgody – w celach analitycznych.
    </p>

    <h2>1. Czym są pliki cookies</h2>
    <p>
      Cookies to niewielkie pliki tekstowe zapisywane na urządzeniu końcowym
      użytkownika (komputer, tablet, smartfon). Cookies umożliwiają poprawne
      działanie strony oraz zapamiętywanie preferencji użytkownika.
    </p>
    <p>
      Szczegółowe informacje dotyczące przetwarzania danych osobowych,
      w tym praw użytkownika, znajdują się w Polityce prywatności
      dostępnej na stronie serwisu.
    </p>

    <h2>2. Rodzaje stosowanych cookies</h2>
    <p>Serwis wykorzystuje następujące kategorie plików cookies:</p>
    <ul>
      <li><strong>Obowiązkowe (mandatory)</strong> – wymagane do działania strony</li>
      <li><strong>Funkcjonalne (functional)</strong> – zapamiętywanie ustawień</li>
      <li><strong>Analityczne (analytics)</strong> – statystyki i analiza ruchu</li>
    </ul>

    <h2>3. Cookies obowiązkowe</h2>
    <p>
      Te pliki cookies są zawsze aktywne i nie wymagają zgody użytkownika,
      ponieważ są konieczne do prawidłowego funkcjonowania strony.
    </p>
    <table>
      <thead>
        <tr>
          <th>Nazwa</th>
          <th>Dostawca</th>
          <th>Cel</th>
          <th>Rodzaj</th>
          <th>Czas</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>cart_id</code></td>
          <td>tiplast.pl</td>
          <td>Przechowywanie wartości koszyka</td>
          <td>HTTP Cookie</td>
          <td>30 dni</td>
        </tr>
         <tr>
          <td><code>cart_quantity</code></td>
          <td>tiplast.pl</td>
          <td>Przechowywanie infromacji o ilości produtków w koszyku</td>
          <td>HTTP Cookie</td>
          <td>30 dni</td>
        </tr>
         <tr>
          <td><code>cart_id</code></td>
          <td>tiplast.pl</td>
          <td>Przechowywanie identyfikatora koszyka</td>
          <td>HTTP Cookie</td>
          <td>30 dni</td>
        </tr>
        <tr>
          <td><code>cookies_consent</code></td>
          <td>tiplast.pl</td>
          <td>Informacja o udzielonej zgodzie cookies</td>
          <td>HTTP Cookie</td>
          <td>12 miesięcy</td>
        </tr>
        <tr>
          <td><code>furgonetka_token</code></td>
          <td>tiplast.pl</td>
          <td>Token pozwalający na komunikację z furgonetka.pl</td>
          <td>HTTP Cookie</td>
          <td>Sesja</td>
        </tr>
        <tr>
          <td><code>furgonetka_token_exp</code></td>
          <td>tiplast.pl</td>
          <td>Informacja o dacie wygaśniecia tokenu</td>
          <td>HTTP Cookie</td>
          <td>Sesja</td>
        </tr>
      </tbody>
    </table>

    <h2>4. Cookies funkcjonalne</h2>
    <p>
      Cookies funkcjonalne wykorzystywane są do zapamiętania ustawień
      użytkownika, takich jak np. wybrana waluta czy język strony.
    </p>
    <h2>5. Cookies analityczne</h2>
    <p>
      Cookies analityczne są zapisywane wyłącznie po wyrażeniu zgody użytkownika.
      Służą do zbierania anonimowych statystyk dotyczących korzystania z serwisu.
    </p>
    <table>
      <thead>
        <tr>
          <th>Nazwa</th>
          <th>Dostawca</th>
          <th>Cel</th>
          <th>Rodzaj</th>
          <th>Czas</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>_ga</code></td>
          <td>Google Analytics</td>
          <td>Statystyki użytkowników</td>
          <td>HTTP Cookie</td>
          <td>24 miesiące</td>
        </tr>
        <tr>
          <td><code>_ga_*</code></td>
          <td>Google Analytics</td>
          <td>Analiza sesji</td>
          <td>HTTP Cookie</td>
          <td>24 miesiące</td>
        </tr>
      </tbody>
    </table>
    <p>
      Dane zbierane za pośrednictwem Google Analytics mogą być
      przekazywane do państw trzecich (w szczególności do USA)
      zgodnie z zasadami określonymi przez dostawcę narzędzia
      oraz na podstawie standardowych klauzul umownych.
    </p>
    <p>
      Użytkownik może w dowolnym momencie cofnąć wyrażoną zgodę
      na cookies analityczne, bez wpływu na zgodność z prawem
      przetwarzania dokonanego przed jej cofnięciem.
    </p>

    <h2>6. Zarządzanie plikami cookies</h2>
    <p>
      Użytkownik może w każdej chwili zmienić ustawienia dotyczące cookies
      za pomocą banera zgód lub ustawień przeglądarki internetowej.
      Ograniczenie stosowania cookies może wpłynąć na niektóre funkcjonalności serwisu.
    </p>

    <h2>7. Zmiany polityki cookies</h2>
    <p>
      Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszej
      polityce cookies w przypadku zmian prawnych lub technologicznych.
    </p>

    <hr class="hr" />
    <h4>Ostatnia aktualizacja: 20.12.2025</h4>
  </section>
</template>

<style scoped>
.legal-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 24px;
  line-height: 1.7;
  font-size: 15px;
}

h1 {
  font-size: 28px;
  color: #32aa27;
  margin-bottom: 16px;
}

h2 {
  margin-top: 32px;
  font-size: 20px;
  color: #333;
}

p {
  margin: 10px 0;
}

ul {
  margin: 10px 0 10px 24px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}

th,
td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: left;
}

th {
  background: #f7f7f7;
  font-weight: 600;
}

code {
  background: #f2f2f2;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.hr {
  margin-top: 50px;
  margin-bottom: 15px;
}
</style>
