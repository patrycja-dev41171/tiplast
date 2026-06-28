<template>
  <section class="legal-page">
    <header class="legal-header">
      <h1>Formularz zwrotu towaru</h1>
      <p>
        Wypełnij poniższy formularz i dołącz go do przesyłki ze zwracanym towarem lub wyślij
        na adres <a href="mailto:kontakt.tiplast@gmail.com">kontakt.tiplast@gmail.com</a>
        przed odesłaniem produktu.
      </p>
    </header>

    <div class="withdrawal-form">
      <div class="wf-addressee">
        <strong>Adresat:</strong><br />
        TIPLAST Iński Tomasz<br />
        Papowo Biskupie 31, 86-221 Papowo Biskupie<br />
        E-mail: <a href="mailto:kontakt.tiplast@gmail.com">kontakt.tiplast@gmail.com</a>
      </div>

      <hr class="wf-divider" />

      <h3 class="wf-section-title">Dane klienta</h3>

      <div class="wf-field"><label>Imię i nazwisko:</label><div class="wf-line" /></div>
      <div class="wf-field"><label>Adres klienta:</label><div class="wf-line" /></div>
      <div class="wf-field"><label>Adres e-mail:</label><div class="wf-line" /></div>
      <div class="wf-field"><label>Numer telefonu:</label><div class="wf-line" /></div>
      <div class="wf-field"><label>Numer zamówienia:</label><div class="wf-line" /></div>
      <div class="wf-field"><label>Data otrzymania towaru:</label><div class="wf-line" /></div>

      <hr class="wf-divider" />

      <h3 class="wf-section-title">Zwracane produkty</h3>

      <div class="wf-products">
        <div v-for="n in 5" :key="n" class="wf-product-row">
          <span>{{ n }}.</span><div class="wf-line wf-line--flex" />
        </div>
      </div>

      <hr class="wf-divider" />

      <h3 class="wf-section-title">Powód zwrotu</h3>
      <div class="wf-checkbox-group">
        <div class="wf-checkbox-row"><span class="wf-box">☐</span><span>Produkt uszkodzony / wadliwy</span></div>
        <div class="wf-checkbox-row"><span class="wf-box">☐</span><span>Produkt niezgodny z opisem</span></div>
        <div class="wf-checkbox-row"><span class="wf-box">☐</span><span>Pomyłka przy zamawianiu</span></div>
        <div class="wf-checkbox-row"><span class="wf-box">☐</span><span>Inny powód:</span></div>
      </div>
      <div class="wf-line" style="margin-top: 8px" />
      <div class="wf-line" />

      <hr class="wf-divider" />

      <h3 class="wf-section-title">Oczekiwana forma rozwiązania</h3>
      <div class="wf-checkbox-group">
        <div class="wf-checkbox-row"><span class="wf-box">☐</span><span>Zwrot pieniędzy na konto bankowe</span></div>
        <div class="wf-checkbox-row"><span class="wf-box">☐</span><span>Wymiana na inny produkt</span></div>
      </div>

      <div class="wf-field" style="margin-top: 16px">
        <label>Numer rachunku bankowego do zwrotu środków:</label>
        <div class="wf-line" />
      </div>
      <div class="wf-field">
        <label>Imię i nazwisko właściciela rachunku:</label>
        <div class="wf-line" />
      </div>

      <hr class="wf-divider" />

      <h3 class="wf-section-title">Dodatkowe uwagi</h3>
      <div class="wf-line" />
      <div class="wf-line" />
      <div class="wf-line" />

      <hr class="wf-divider" />

      <div class="wf-footer">
        <div class="wf-field"><label>Data:</label><div class="wf-line" /></div>
        <div class="wf-field">
          <label>Podpis klienta:</label>
          <div class="wf-line" />
          <span class="wf-hint">/ wymagany tylko w przypadku formularza wysyłanego w formie papierowej /</span>
        </div>
      </div>
    </div>
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
  margin-bottom: 28px;
}

h1 {
  font-size: 28px;
  color: #32aa27;
  margin-bottom: 10px;
}

a { color: #32aa27; }
p { margin: 10px 0; }

.withdrawal-form {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 28px;
  background: #fafafa;
  font-size: 14px;
}

.wf-addressee { line-height: 1.8; }

.wf-divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 20px 0;
}

.wf-section-title {
  font-size: 13px;
  font-weight: 700;
  color: #111;
  margin: 0 0 14px;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.wf-field { margin-bottom: 14px; }

.wf-field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.wf-line {
  border: none;
  border-bottom: 1px solid #9ca3af;
  height: 28px;
  margin-bottom: 6px;
}

.wf-line--flex { flex: 1; }

.wf-checkbox-group { display: flex; flex-direction: column; gap: 8px; }

.wf-checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: #374151;
}

.wf-box { font-size: 16px; flex-shrink: 0; }

.wf-products {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wf-product-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.wf-hint {
  display: block;
  font-size: 11px;
  color: #9ca3af;
  font-style: italic;
  margin-top: 4px;
}
</style>
