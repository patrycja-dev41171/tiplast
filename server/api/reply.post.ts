import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, reply_text } = body;

  if (!email || !reply_text) {
    throw createError({
      statusCode: 400,
      statusMessage: "Brak wymaganych pól."
    });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"Tiplast.pl" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Dziękujemy za kontakt z Tiplast",
      replyTo: process.env.SMTP_USER,
      html: `
        <div style="font-family:Arial; font-size:15px;">
          ${reply_text}

          <br><br>
          <p style="color:#888;font-size:13px;">
            Pozdrawiamy,<br>
            Zespół Tiplast
          </p>
        </div>
      `
    });

    return { ok: true };
  } catch (err) {
    console.error("Błąd wysyłki e-maila:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Nie udało się wysłać wiadomości."
    });
  }
});
