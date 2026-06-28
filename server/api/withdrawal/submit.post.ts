import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

const generateWithdrawalNumber = () => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `ZWR-${date}-${rand}`
}

const itemsHtml = (items: any[]) =>
  items.map(i => `<li>${i.name} (${i.sku}) — ${i.quantity} szt.</li>`).join('')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const {
    order_id, order_number,
    firstname, lastname, email, phone,
    withdrawal_type, items,
    reason, bank_account, account_holder,
  } = body

  if (!order_id || !firstname || !lastname || !email || !phone || !bank_account || !account_holder) {
    throw createError({ statusCode: 400, statusMessage: 'Brak wymaganych pól.' })
  }

  const withdrawal_number = generateWithdrawalNumber()

  // ── Zapis do bazy ────────────────────────────────────────────────────────────
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  const { error: dbError } = await supabase.from('withdrawal_requests').insert({
    withdrawal_number,
    order_id,
    order_number,
    firstname,
    lastname,
    email,
    phone,
    withdrawal_type,
    items,
    reason: reason || null,
    bank_account,
    account_holder,
    status: 'pending',
  })

  if (dbError) {
    console.error('[withdrawal] DB error:', dbError)
    throw createError({ statusCode: 500, statusMessage: 'Błąd zapisu do bazy danych.' })
  }

  // ── Email ────────────────────────────────────────────────────────────────────
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  const typeLabel = withdrawal_type === 'full' ? 'Całość zamówienia' : 'Część zamówienia'
  const itemsList = items?.length ? `<ul>${itemsHtml(items)}</ul>` : '<p>—</p>'

  // Mail do sklepu (Tomasz + kontakt)
  const shopHtml = `
    <h2 style="color:#32aa27">Nowe oświadczenie o odstąpieniu od umowy</h2>
    <p><strong>Numer zwrotu:</strong> ${withdrawal_number}</p>
    <p><strong>Zamówienie:</strong> ${order_number}</p>
    <hr/>
    <p><strong>Klient:</strong> ${firstname} ${lastname}</p>
    <p><strong>E-mail:</strong> ${email}</p>
    <p><strong>Telefon:</strong> ${phone}</p>
    <hr/>
    <p><strong>Zakres:</strong> ${typeLabel}</p>
    <p><strong>Zwracane produkty:</strong></p>
    ${itemsList}
    <hr/>
    <p><strong>Powód:</strong> ${reason || '—'}</p>
    <p><strong>Numer konta do zwrotu:</strong> ${bank_account}</p>
    <p><strong>Właściciel rachunku:</strong> ${account_holder}</p>
  `

  // Mail do klienta (potwierdzenie)
  const clientHtml = `
    <h2 style="color:#32aa27">Potwierdzenie oświadczenia o odstąpieniu od umowy</h2>
    <p>Drogi/a ${firstname} ${lastname},</p>
    <p>Otrzymaliśmy Twoje oświadczenie o odstąpieniu od umowy dotyczące zamówienia <strong>${order_number}</strong>.</p>
    <p style="font-size:18px;font-weight:bold;border:2px solid #32aa27;display:inline-block;padding:8px 16px;border-radius:8px">
      Numer zwrotu: ${withdrawal_number}
    </p>
    <p>Skontaktujemy się z Tobą wkrótce w celu potwierdzenia przyjęcia oświadczenia i przekazania dalszych instrukcji dotyczących zwrotu towaru.</p>
    <p><strong>Prosimy nie odsyłać towaru przed otrzymaniem potwierdzenia od nas.</strong></p>
    <hr/>
    <p style="font-size:12px;color:#6b7280">
      TIPLAST Iński Tomasz · Papowo Biskupie 31, 86-221 Papowo Biskupie<br/>
      kontakt.tiplast@gmail.com · tel. +48 608 467 068
    </p>
  `

  try {
    await Promise.all([
      transporter.sendMail({
        from: `"Tiplast.pl" <${process.env.SMTP_USER}>`,
        to: ['tiplast@wp.pl', 'kontakt.tiplast@gmail.com'],
        subject: `[Zwrot ${withdrawal_number}] Odstąpienie od umowy — zam. ${order_number}`,
        replyTo: email,
        html: shopHtml,
      }),
      transporter.sendMail({
        from: `"Tiplast.pl" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Potwierdzenie odstąpienia od umowy — nr zwrotu ${withdrawal_number}`,
        replyTo: 'kontakt.tiplast@gmail.com',
        html: clientHtml,
      }),
    ])
  } catch (err) {
    console.error('[withdrawal] Mail error:', err)
    // Nie rzucamy błędu — zapis do bazy się udał, mail jest opcjonalny
  }

  return { ok: true, withdrawal_number }
})
