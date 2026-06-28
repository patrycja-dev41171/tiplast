import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const { id, status, rejection_reason } = await readBody(event)
  const config = useRuntimeConfig()

  if (!id || !status) {
    throw createError({ statusCode: 400, statusMessage: 'Brak wymaganych pól.' })
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  const { data: w, error: fetchError } = await supabase
    .from('withdrawal_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !w) {
    throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono oświadczenia.' })
  }

  const updatePayload: Record<string, any> = { status }
  if (status === 'rejected' && rejection_reason) updatePayload.rejection_reason = rejection_reason

  const { error: updateError } = await supabase
    .from('withdrawal_requests')
    .update(updatePayload)
    .eq('id', id)

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: 'Błąd aktualizacji statusu.' })
  }

  // Mail do klienta tylko przy zmianie na "confirmed"
  if (status === 'confirmed') {
    const withdrawalDate = new Date(w.created_at).toLocaleDateString('pl-PL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })

    const refundDeadline = new Date(new Date(w.created_at).getTime() + 14 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })

    const itemsList = w.items?.length
      ? `<ul style="margin:8px 0;padding-left:20px">${w.items.map((i: any) => `<li>${i.name} — ${i.quantity} szt.</li>`).join('')}</ul>`
      : '<p>—</p>'

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#222">
        <div style="background:#32aa27;padding:24px 28px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">Zwrot zatwierdzony</h1>
        </div>
        <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">

          <p>Drogi/a <strong>${w.firstname} ${w.lastname}</strong>,</p>
          <p>
            Twoje oświadczenie o odstąpieniu od umowy dotyczące zamówienia
            <strong>${w.order_number}</strong> (nr zwrotu: <strong>${w.withdrawal_number}</strong>)
            zostało zatwierdzone.
          </p>

          <h3 style="color:#32aa27;margin-top:24px">Zwrot towaru</h3>
          <p>Prosimy o odesłanie poniższych produktów na adres:</p>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin:12px 0">
            <strong>TIPLAST Iński Tomasz</strong><br/>
            Papowo Biskupie 31<br/>
            86-221 Papowo Biskupie<br/>
            tel. <a href="tel:+48608467068" style="color:#32aa27">+48 608 467 068</a>
          </div>

          <p><strong>Zwracane produkty:</strong></p>
          ${itemsList}

          <p style="color:#ef4444;font-weight:600">
            Prosimy dołączyć do paczki numer zwrotu: ${w.withdrawal_number}
          </p>

          <h3 style="color:#32aa27;margin-top:24px">Zwrot płatności</h3>
          <p>
            Pieniądze zostaną zwrócone na podany numer rachunku bankowego
            w ciągu <strong>14 dni od daty złożenia oświadczenia</strong> (tj. do <strong>${refundDeadline}</strong>),
            pod warunkiem otrzymania przez nas zwróconego towaru.
          </p>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin:12px 0">
            <strong>Nr konta:</strong> ${w.bank_account}<br/>
            <strong>Właściciel:</strong> ${account_holder_or_name(w)}
          </div>

          <p style="font-size:12px;color:#9ca3af;margin-top:28px;border-top:1px solid #f3f4f6;padding-top:16px">
            TIPLAST Iński Tomasz · Papowo Biskupie 31, 86-221 Papowo Biskupie<br/>
            kontakt.tiplast@gmail.com · tel. +48 608 467 068<br/>
            Data złożenia oświadczenia: ${withdrawalDate} · Nr zwrotu: ${w.withdrawal_number}
          </p>
        </div>
      </div>
    `

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })

      await transporter.sendMail({
        from: `"Tiplast.pl" <${process.env.SMTP_USER}>`,
        to: w.email,
        subject: `Zwrot zatwierdzony — nr ${w.withdrawal_number} · zam. ${w.order_number}`,
        replyTo: 'kontakt.tiplast@gmail.com',
        html,
      })
    } catch (err) {
      console.error('[withdrawal] Mail potwierdzenie error:', err)
    }
  }

  if (status === 'rejected' && rejection_reason) {
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#222">
        <div style="background:#ef4444;padding:24px 28px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">Oświadczenie o odstąpieniu od umowy — odrzucone</h1>
        </div>
        <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">

          <p>Drogi/a <strong>${w.firstname} ${w.lastname}</strong>,</p>
          <p>
            Informujemy, że Twoje oświadczenie o odstąpieniu od umowy dotyczące zamówienia
            <strong>${w.order_number}</strong> (nr zwrotu: <strong>${w.withdrawal_number}</strong>)
            zostało <strong style="color:#ef4444">odrzucone</strong>.
          </p>

          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;margin:20px 0">
            <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#ef4444;text-transform:uppercase;letter-spacing:.04em">
              Powód odrzucenia
            </p>
            <p style="margin:0;color:#7f1d1d">${rejection_reason}</p>
          </div>

          <p>Jeśli masz pytania lub chcesz odwołać się od tej decyzji, prosimy o kontakt:</p>
          <ul style="padding-left:20px;color:#374151">
            <li>E-mail: <a href="mailto:kontakt.tiplast@gmail.com" style="color:#32aa27">kontakt.tiplast@gmail.com</a></li>
            <li>Telefon: <a href="tel:+48608467068" style="color:#32aa27">+48 608 467 068</a></li>
          </ul>

          <p style="font-size:12px;color:#9ca3af;margin-top:28px;border-top:1px solid #f3f4f6;padding-top:16px">
            TIPLAST Iński Tomasz · Papowo Biskupie 31, 86-221 Papowo Biskupie<br/>
            kontakt.tiplast@gmail.com · tel. +48 608 467 068<br/>
            Nr zwrotu: ${w.withdrawal_number}
          </p>
        </div>
      </div>
    `

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })

      await transporter.sendMail({
        from: `"Tiplast.pl" <${process.env.SMTP_USER}>`,
        to: w.email,
        subject: `Oświadczenie odrzucone — nr ${w.withdrawal_number} · zam. ${w.order_number}`,
        replyTo: 'kontakt.tiplast@gmail.com',
        html,
      })
    } catch (err) {
      console.error('[withdrawal] Mail odrzucenie error:', err)
    }
  }

  return { ok: true }
})

const account_holder_or_name = (w: any) =>
  w.account_holder || `${w.firstname} ${w.lastname}`
