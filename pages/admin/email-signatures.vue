<template>
  <div class="admin-page">
    <AdminPageHeader text="Stopki e-mail / Podpisy" />

    <v-row>
      <v-col v-for="signature in signatures" :key="signature.id" cols="12" md="6">
        <EmailSignatureCard :signature="signature" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin-client'
})

import EmailSignatureCard from '@/components/admin/email-signatures/EmailSignatureCard.vue'

const signatures = [
  {
    id: 'main',
    name: 'Podpis główny',
    html: `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial;font-size:13px; border: 1px, solid, #ddd;padding:10px; width: 650px">
  <tr>
    <td style="padding-right:12px;">
      <img style="width:220px" src="https://ci3.googleusercontent.com/meips/ADKq_Nbcr4wrZgcH3HwP0RVgek5I9QkbEyAjc30NHibOjvQ0CDl4a8haZ5E3PzGvORn108WPVHF8yTvq9L426zkoc990ws-n4oSYLEPrdvTNZvsS-2pArwWx2lCWdgoZnm8aKPZ3yScxxYPTgGsVCyVag8hVBN3jw7txdeCJHpAe7g=s0-d-e1-ft#https://zwxmjgkxy3iroyzbaorwcqupghcx8owqnqvc4ldhh8e.canva-cdn.email/a36490018107acab6ae7eb2d55401357.png" width="80" />
    </td>
    <td style="font-size: 13px">
      <strong  style="font-size: 15px">Tiplast Iński Tomasz</strong><br />       	
31, 86-221 Papowo Biskupie, Polska<br />
      Tel: <a href="tel:+48608467068"  style="font-size: 13px">+48 608 467 068</a><br />
      E-mail: <a href="mailto:kontakt.tiplast@gmail.com" style="font-size: 13px">kontakt.tiplast@gmail.com</a><br />
      NIP: 5621212221
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top:8px;font-size:11px;color:#666;">
      RODO/GDPR: Administratorem danych jest Tiplast Iński Tomasz. Dane przetwarzamy w celu prowadzenia korespondencji i obsługi spraw (art. 6 ust. 1 lit. b/f RODO). Szczegóły: tiplast.pl.
    </td>
  </tr>
</table>
`
  },
  {
    id: 'main',
    name: 'Email',
    html: `
    <div style="width:650px;background:#fff;">
     <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fff;">
  <tr>
    <td align="center" style="padding:20px;">
      <img
        src="https://ci3.googleusercontent.com/meips/ADKq_Nbcr4wrZgcH3HwP0RVgek5I9QkbEyAjc30NHibOjvQ0CDl4a8haZ5E3PzGvORn108WPVHF8yTvq9L426zkoc990ws-n4oSYLEPrdvTNZvsS-2pArwWx2lCWdgoZnm8aKPZ3yScxxYPTgGsVCyVag8hVBN3jw7txdeCJHpAe7g=s0-d-e1-ft#https://zwxmjgkxy3iroyzbaorwcqupghcx8owqnqvc4ldhh8e.canva-cdn.email/a36490018107acab6ae7eb2d55401357.png"
        width="250"
        style="display:block;border:0;outline:none;text-decoration:none;"
        alt="Logo"
      />
    </td>
  </tr>
</table>

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="font-family:Arial,Helvetica,sans-serif;color:#000;padding:10px;">
      
      <p style="font-size:18px;margin:0 0 14px 0;">
        Dziękujemy za twój zakup na
        <a
          href="https://tiplast.pl"
          style="color:#000;text-decoration:underline;font-weight:bold;"
        >
          tiplast.pl
        </a>.
      </p>

      <p style="font-size:16px;margin:0 0 14px 0;">
        Twoje zamówienie oczekuje na płatność.
      </p>

      <p style="font-size:16px;margin:0 0 0px 0;">
        Link do zamówienia i płatności:
        <a
          href="https://tiplast.pl/zamowienie/${order.order_id}"
          style="color:#1a73e8;text-decoration:underline;font-weight:bold;"
        >
          ${order.order_id}
        </a>
      </p>

    </td>
  </tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0">
  <tr>
    <td align="center" style="padding:15px;">
      <table
        width="450"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="border:2px solid #000;font-family:Arial,Helvetica,sans-serif;"
      >
        <tr>
          <td align="center" style="padding:20px;">
            <p style="margin:0;font-size:16px;">
              Numer twojego zamówienia:
            </p>

            <p style="margin:0;font-size:28px;font-weight:bold;">
              <a
                href="https://tiplast.pl/zamowienie/${order.order_id}"
                style="color:#000;text-decoration:none;"
              >
                ${order.order_id}
              </a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
      
      <table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial;font-size:13px; border: 1px, solid, #ddd;padding:10px; width: 650px">
  <tr>
    <td style="padding-right:12px;">
      <img style="width:220px" src="https://ci3.googleusercontent.com/meips/ADKq_Nbcr4wrZgcH3HwP0RVgek5I9QkbEyAjc30NHibOjvQ0CDl4a8haZ5E3PzGvORn108WPVHF8yTvq9L426zkoc990ws-n4oSYLEPrdvTNZvsS-2pArwWx2lCWdgoZnm8aKPZ3yScxxYPTgGsVCyVag8hVBN3jw7txdeCJHpAe7g=s0-d-e1-ft#https://zwxmjgkxy3iroyzbaorwcqupghcx8owqnqvc4ldhh8e.canva-cdn.email/a36490018107acab6ae7eb2d55401357.png" width="80" />
    </td>
    <td style="font-size: 13px">
      <strong  style="font-size: 15px">Tiplast Iński Tomasz</strong><br />       	
31, 86-221 Papowo Biskupie, Polska<br />
      Tel: <a href="tel:+48608467068"  style="font-size: 13px">+48 608 467 068</a><br />
      E-mail: <a href="mailto:kontakt.tiplast@gmail.com" style="font-size: 13px">kontakt.tiplast@gmail.com</a><br />
      NIP: 5621212221
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top:8px;font-size:11px;color:#666;">
      RODO/GDPR: Administratorem danych jest Tiplast Iński Tomasz. Dane przetwarzamy w celu prowadzenia korespondencji i obsługi spraw (art. 6 ust. 1 lit. b/f RODO). Szczegóły: tiplast.pl.
    </td>
  </tr>
</table>
      </div>
    `
  }
]
</script>

<style scoped>
.admin-page {
  padding: 24px;
}
</style>
