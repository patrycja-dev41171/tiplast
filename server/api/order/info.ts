import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const { order } = body;

    if (!order) {
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


    const target_email = "tiplast@wp.pl";
    const admin_email = "kontakt.tiplast@gmail.com";

    try {
        await transporter.sendMail({
            from: `"Tiplast.pl" <${process.env.SMTP_USER}>`,
            to: [target_email, admin_email],
            subject: `Nowe zamówienie ze strony: ${order.order_number}`,
            replyTo: process.env.SMTP_USER,
            html: `
    <h3>Nowe zamówienie ze strony: tiplast.pl</h3>
    <h4>Numer zamówienie: ${order.order_number}</h4>

    <p><strong>Imię i nazwisko:</strong> ${order.firstname} ${order.lastname}</p>
    <p><strong>E-mail:</strong> ${order.email}</p>

    <h3><a href="https://tiplast.pl/admin/order/view/${order.order_id
                }">Link do zamówienia</a></h3>

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
