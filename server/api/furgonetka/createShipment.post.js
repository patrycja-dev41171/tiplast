import { getFurgonetkaTokenFromCookie } from "~/server/utils/furgonetkaTokenCookie"

export default defineEventHandler(async (event) => {
    const token = await getFurgonetkaTokenFromCookie(event)
    const { order } = await readBody(event)

    if (!order) {
        throw createError({
            statusCode: 400,
            statusMessage: "Brak danych zamówienia"
        })
    }

    if (!order.order_parcels?.length) {
        throw createError({
            statusCode: 400,
            statusMessage: "Brak paczek w zamówieniu"
        })
    }

    const totalPrice = order.order_items.reduce(
        (sum, i) => sum + i.quantity * i.price_snapshot,
        0
    )

    const isCOD = order.order_payment_details?.cod === true

    const payload = {
        pickup: {
            name: "TIPLAST Iński Tomasz",
            street: "Papowo Biskupie 31",
            postcode: "86-221",
            city: "Papowo Biskupie",
            country_code: "PL",
            phone: "+48608467068",
            email: "tiplast@wp.pl"
        },
        receiver: {
            name: `${order.firstname} ${order.lastname}`,
            company: order.company || "",
            street: `${order.street} ${order.street_number || ""}`,
            postcode: order.zip,
            city: order.city,
            country_code: order.country,
            email: order.email,
            phone: order.phone
        },
        service_id: order.order_shipping_details.service_id,
        parcels: order.order_parcels.map(p => ({
            width: p.width,
            depth: p.length,
            height: p.height,
            weight: p.weight,
            value: isCOD ? (totalPrice + order.order_shipping_details.price_gross) / order.order_parcels.length : totalPrice / order.order_parcels.length
        })),
        type: "package",

        ...(isCOD && {
            additional_services: {
                cod: {
                    amount: totalPrice + order.order_shipping_details.price_gross,
                    currency: "PLN",
                    express: false,
                    iban: "94132015372252938930000001",
                    name: "TIPLAST Iński Tomasz"
                },
                additional_insurance: true
            }
        })
    }

    const response = await $fetch(
        "https://api.furgonetka.pl/packages",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/vnd.furgonetka.v1+json"
            },
            body: payload
        }
    )

    return {
        success: true,
        package_id: response.package_id,
        tracking_number: response.tracking_number,
        label_url: response.documents?.label,
        response
    }
})