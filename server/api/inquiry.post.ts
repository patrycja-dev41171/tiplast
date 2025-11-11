import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, phone, quantity, message, product, sku, link } = body;

  if (!name || !email || !phone || !quantity || !product || !link || !sku) {
    throw createError({
      statusCode: 400,
      statusMessage: "Brak wymaganych pól.",
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"tiplast.pl" <${process.env.SMTP_USER}>`,
      to: ["kontakt.tiplast@gmail.com", "tiplast@wp.pl"],
      subject: `Zapytanie o produkt: ${product}`,
      html: `
        <h3>Nowe zapytanie o produkt</h3>
        <p><strong>Produkt:</strong> ${product}</p>
        <p><strong>SKU:</strong> ${sku}</p>
        <p><strong>Link:</strong> ${link}</p>
        <p><strong>Ilość sztuk:</strong> ${quantity}</p>
        <hr>
        <p><strong>Imię i nazwisko:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        ${
          message
            ? `<p><strong>Wiadomość:</strong><br>${message}</p>`
            : "<p><em>Bez dodatkowej wiadomości.</em></p>"
        }
      `,
    });

    return { ok: true };
  } catch (err) {
    console.error("Błąd wysyłki e-maila:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Nie udało się wysłać zapytania.",
    });
  }
});
