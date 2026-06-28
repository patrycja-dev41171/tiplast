<template>
  <section class="legal-page">
    <header class="legal-header">
      <h1>Zwroty i odstąpienie od umowy</h1>
      <p>
        Klient będący konsumentem ma prawo odstąpić od umowy zawartej na odległość, czyli m.in. przez
        sklep internetowy, w terminie <strong>14 dni</strong> bez podawania przyczyny. Termin ten co do zasady
        liczy się od dnia, w którym klient lub wskazana przez niego osoba, inna niż przewoźnik, objęła
        towar w posiadanie. W przypadku zamówienia obejmującego kilka produktów dostarczanych osobno,
        termin liczy się od objęcia w posiadanie ostatniego produktu, partii lub części zamówienia.
      </p>
      <p>
        Aby odstąpić od umowy, należy poinformować nas o swojej decyzji w drodze jednoznacznego
        oświadczenia, np. poprzez formularz odstąpienia od umowy, wiadomość e-mail lub pismo wysłane
        pocztą. Do zachowania terminu wystarczy wysłanie oświadczenia przed upływem 14 dni.
      </p>
      <p>Możesz skorzystać z odpowiedniego formularza dostępnego poniżej:</p>
      <div class="form-buttons">
        <NuxtLink to="/odstapienie-od-umowy" class="form-btn">
          <v-icon icon="mdi-file-document-outline" size="22" />
          <span class="form-btn-text">
            <strong>Odstąp od umowy</strong>
            <small>formularz odstąpienia od umowy</small>
          </span>
        </NuxtLink>
      </div>
      <p class="note">Skorzystanie z formularza nie jest obowiązkowe — jest to jedynie ułatwienie.</p>
    </header>

    <section class="legal-section">
      <h2>Dane do złożenia oświadczenia</h2>
      <p>Oświadczenie o odstąpieniu od umowy można przesłać:</p>
      <ul>
        <li>
          <strong>E-mail:</strong>{{ ' ' }}
          <a href="mailto:kontakt.tiplast@gmail.com">kontakt.tiplast@gmail.com</a>
        </li>
        <li>
          <strong>Adres pocztowy:</strong>
          TIPLAST Iński Tomasz, Papowo Biskupie 31, 86-221 Papowo Biskupie
        </li>
        <li>
          <strong>Adres do zwrotu towaru:</strong>
          TIPLAST Iński Tomasz, Papowo Biskupie 31, 86-221 Papowo Biskupie
        </li>
      </ul>
    </section>

    <section class="legal-section">
      <h2>Zwrot towaru</h2>
      <p>
        Po złożeniu oświadczenia o odstąpieniu od umowy, w tym poprzez formularz dostępny na stronie,
        prześlemy klientowi potwierdzenie otrzymania oświadczenia na podany adres e-mail.
      </p>
      <p>
        Prosimy o odesłanie produktu dopiero po otrzymaniu od nas potwierdzenia przyjęcia oświadczenia
        o odstąpieniu od umowy oraz informacji dotyczących dalszej procedury zwrotu.
      </p>
      <p>Towar należy odesłać na adres:</p>
      <p class="address-box">
        <strong>TIPLAST Iński Tomasz</strong><br />
        Papowo Biskupie 31<br />
        86-221 Papowo Biskupie
      </p>
      <p>
        Towar należy odesłać niezwłocznie, nie później niż w terminie <strong>14 dni</strong> od dnia złożenia
        oświadczenia o odstąpieniu od umowy, chyba że w potwierdzeniu wskażemy inne indywidualne
        ustalenia zgodne z obowiązującymi przepisami.
      </p>
      <p>
        Konsument ponosi bezpośrednie koszty odesłania towaru, chyba że sklep wyraźnie zgodził się
        je ponieść albo nie poinformował klienta o konieczności poniesienia tych kosztów.
      </p>
      <p>
        Klient odpowiada za zmniejszenie wartości towaru wynikające z korzystania z niego w sposób
        wykraczający poza konieczny do stwierdzenia charakteru, cech i funkcjonowania produktu.
      </p>
    </section>

    <section class="legal-section">
      <h2>Zwrot płatności</h2>
      <p>
        W przypadku odstąpienia od umowy zwrócimy klientowi wszystkie otrzymane płatności, w tym koszt
        najtańszego zwykłego sposobu dostarczenia rzeczy oferowanego w sklepie, niezwłocznie, nie później
        niż w terminie <strong>14 dni</strong> od dnia otrzymania oświadczenia o odstąpieniu od umowy.
        Zwrot płatności nastąpi przy użyciu takiego samego sposobu płatności, jakiego użył klient,
        chyba że klient wyraźnie zgodzi się na inny sposób zwrotu, który nie wiąże się dla niego
        z żadnymi kosztami.
      </p>
      <p>
        Możemy wstrzymać się ze zwrotem płatności do chwili otrzymania zwracanego towaru albo
        dostarczenia przez klienta dowodu jego odesłania — w zależności od tego, które zdarzenie
        nastąpi wcześniej.
      </p>
    </section>

    <section class="legal-section">
      <h2>Wyjątki od prawa odstąpienia od umowy</h2>
      <p>
        Prawo odstąpienia od umowy nie przysługuje m.in. w odniesieniu do umów, których przedmiotem jest:
      </p>
      <ul>
        <li>produkt nieprefabrykowany, wykonany według specyfikacji klienta lub służący zaspokojeniu jego zindywidualizowanych potrzeb,</li>
        <li>produkt szybko psujący się lub z krótkim terminem przydatności,</li>
        <li>
          produkt dostarczony w zapieczętowanym opakowaniu, którego po otwarciu nie można zwrócić
          ze względów higienicznych lub zdrowotnych, jeżeli opakowanie zostało otwarte po dostarczeniu,
        </li>
        <li>a także w innych przypadkach przewidzianych przepisami prawa.</li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.legal-page {
  max-width: 860px;
  margin: 40px auto;
  padding: 0 24px 60px;
  line-height: 1.7;
}

.legal-header {
  margin-bottom: 36px;
}

h1 {
  font-size: 28px;
  color: #32aa27;
  margin-bottom: 14px;
}

h2 {
  font-size: 18px;
  color: #333;
  margin: 0 0 12px;
}

.legal-section {
  margin-bottom: 36px;
  padding-bottom: 36px;
  border-bottom: 1px solid #f0f0f0;
}

.legal-section:last-child {
  border-bottom: none;
}

a {
  color: #32aa27;
}

.form-link {
  font-weight: 600;
  text-decoration: underline;
}

.note {
  font-size: 13px;
  color: #6b7280;
  font-style: italic;
}

ul {
  margin: 10px 0 10px 28px;
}

li {
  margin-bottom: 8px;
}

p {
  margin: 10px 0;
}

.form-buttons {
  display: flex;
  gap: 14px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.form-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 10px;
  text-decoration: none;
  border: 2px solid #32aa27;
  background: #fff;
  color: #111;
  transition: background 0.15s, transform 0.15s;

  &:hover {
    background: #f0fdf4;
    transform: translateY(-1px);
  }
}

.form-btn-text {
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong { font-size: 14px; font-weight: 700; color: #111; }
  small  { font-size: 12px; color: #6b7280; }
}

.address-box {
  background: #f9fafb;
  border-left: 3px solid #32aa27;
  padding: 12px 16px;
  border-radius: 0 6px 6px 0;
  font-size: 14px;
  line-height: 1.8;
  margin: 12px 0;
}
</style>
