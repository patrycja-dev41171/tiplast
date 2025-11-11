import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { name, email, phone, message } = body;

  if (!name || !email || !phone || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Brak wymaganych pól.",
    });
  }

  // konfiguracja maila (np. Gmail SMTP)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Tiplast.pl" <${process.env.SMTP_USER}>`,
      to: "inski.oskar@gmail.com",
      subject: `Nowa wiadomość od ${name}`,
      html: `
        <h3>Nowa wiadomość z formularza kontaktowego</h3>
        <p><strong>Imię i nazwisko:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Wiadomość:</strong><br>${message}</p>
      `,
    });

    return { ok: true };
  } catch (err) {
    console.error("Błąd wysyłki e-maila:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Nie udało się wysłać wiadomości.",
    });
  }
});
