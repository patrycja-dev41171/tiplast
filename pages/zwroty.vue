<template>
  <section class="legal-page">
    <header class="returns-header">
      <h1>Zwroty i odstąpienie od umowy</h1>
      <p>
        Twoje zadowolenie jest dla nas bardzo ważne. Zgodnie z przepisami prawa Unii Europejskiej
        oraz polskiej ustawy o prawach konsumenta, Klient ma prawo odstąpić od umowy zawartej
        na odległość w terminie <strong>14 dni od dnia otrzymania zamówienia</strong>, bez podawania przyczyny.
      </p>
    </header>

    <section class="returns-section">
      <h2>1. Jak zgłosić chęć zwrotu?</h2>
      <p>
        Aby zwrócić produkt, skontaktuj się z nami mailowo: <a :href="`mailto:kontakt.tiplast@gmail.com`"><strong>kontakt.tiplast@gmail.com</strong></a>
      </p>
        
      <p>W wiadomości podaj:</p>
      <ul>
        <li>numer zamówienia,</li>
        <li>imię i nazwisko,</li>
        <li>nazwę zwracanego produktu,</li>
        <li>krótką informację: „Chcę odstąpić od umowy”.</li>
      </ul>
      <p>
        Po zgłoszeniu otrzymasz od nas instrukcję zwrotu oraz adres, na który należy odesłać przesyłkę.
      </p>
    </section>

    <section class="returns-section">
      <h2>2. Termin na odesłanie towaru</h2>
      <p>
        Po zgłoszeniu odstąpienia od umowy masz <strong>14 dni na odesłanie produktu</strong>.
        Zwrot zostanie uznany, jeśli paczka zostanie nadana przed upływem tego terminu.
      </p>
    </section>

    <section class="returns-section">
      <h2>3. Koszty zwrotu</h2>
      <p>Zgodnie z obowiązującymi przepisami:</p>
      <ul>
        <li><strong>koszt odesłania produktu ponosi Klient</strong>,</li>
        <li>
          Sprzedawca zwraca całość wpłaconej kwoty (w tym koszt najtańszej dostępnej dostawy),
          o ile zwrot zostanie dokonany zgodnie z przepisami ustawy.
        </li>
      </ul>
      <p>
        Jeżeli przy składaniu zamówienia wybrano droższą metodę dostawy niż standardowa,
        zwracamy koszt najtańszej dostępnej opcji dostawy oferowanej w sklepie.
      </p>
    </section>

    <section class="returns-section">
      <h2>4. Stan zwracanego produktu</h2>
      <p>
        Zwracany produkt powinien znajdować się w stanie
        <strong>umożliwiającym ponowne wprowadzenie do sprzedaży</strong>, bez śladów użytkowania wykraczających poza zwykłe sprawdzenie produktu tzn.:
      </p>
      <ul>
        <li>nie może być uszkodzony ani zabrudzony,</li>
        <li>
          nie powinien nosić śladów użytkowania wykraczających poza
          zwykłe sprawdzenie produktu,
        </li>
        <li>
          powinien zawierać komplet akcesoriów oraz – o ile to możliwe – oryginalne opakowanie.
        </li>
      </ul>
      <p>
        Jeżeli zwracany produkt będzie wyraźnie używany, uszkodzony lub niekompletny,
        Sprzedawca może <strong>odpowiednio obniżyć kwotę zwrotu</strong>, proporcjonalnie do
        utraty wartości towaru.
      </p>
    </section>

    <section class="returns-section">
      <h2>5. Zwrot środków</h2>
      <p>
        Zwrot płatności zostanie dokonany w terminie
        <strong>do 14 dni roboczych</strong> od dnia:
      </p>
      <ul>
        <li>otrzymania zwracanego produktu.</li>
      </ul>
      <p>
        Zwrot środków nastąpi przy użyciu takiego samego sposobu płatności, jakiego użyto
        przy zakupie, chyba że uzgodnimy z Tobą inną formę zwrotu.
      </p>
    </section>

    <section class="returns-section">
      <h2>6. Kiedy zwrot nie jest możliwy?</h2>
      <p>
        Prawo odstąpienia od umowy nie przysługuje w przypadkach przewidzianych w art. 38
        ustawy o prawach konsumenta, w szczególności w odniesieniu do:
      </p>
      <ul>
        <li>produktów wykonanych według specyfikacji Klienta lub służących zaspokojeniu jego zindywidualizowanych potrzeb,</li>
        <li>produktów dostarczanych w zapieczętowanym opakowaniu, które po otwarciu nie mogą zostać zwrócone ze względów higienicznych,</li>
        <li>produktów szybko psujących się lub mających krótki termin przydatności do użycia.</li>
      </ul>
      <p>
        Jeżeli masz wątpliwości, czy dany produkt podlega zwrotowi – skontaktuj się z nami przed złożeniem zamówienia lub przed jego odesłaniem.
      </p>
    </section>

    <section class="returns-section">
      <h2>7. Kontakt w sprawie zwrotów</h2>
      <p>
        W razie pytań dotyczących zwrotów i odstąpienia od umowy skontaktuj się z nami: <a :href="`mailto:kontakt.tiplast@gmail.com`"><strong>kontakt.tiplast@gmail.com</strong></a>
      </p>
       
    </section>
  </section>
</template>

<style scoped>
.legal-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 24px;
  line-height: 1.6;
}

h1 {
  font-size: 28px;
  color: #32aa27;
  margin-bottom: 10px;
}
h2 {
  margin-top: 30px;
  font-size: 20px;
  color: #333;
}
a {
  color: #32aa27;
}
ul {
    margin-left: 30px;
}
p {
    margin: 10px 0;
}
</style>
