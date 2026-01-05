import { getFurgonetkaTokenFromCookie } from "~/server/utils/furgonetkaTokenCookie"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = await getFurgonetkaTokenFromCookie(event)

  const { cart, parcels, service, cod } = body

  if (!parcels?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Brak paczek do wyceny"
    })
  }

  /**
   * 1️⃣ Serwisy, które CHCEMY sprawdzić
   */
  const carriersConfigCOD = {
    inpost: { service: "inpost", cod: true, label: "Kurier InPost - płatność przy odbiorze", type: "courier_cod" },
    dpd: { service: "dpd", cod: true, label: "Kurier DPD - płatność przy odbiorze", type: "courier_cod" },
  }

  const carriersConfigCOURIER = {
    inpost: { service: "inpost", cod: false, label: "Kurier InPost", type: "courier" },
    dpd: { service: "dpd", cod: false, label: "Kurier DPD", type: "courier" },
  }

  const carriersConfig = cod ? carriersConfigCOD : carriersConfigCOURIER


  const additionalServices = {}

  if (cod === true) {
    additionalServices.cod = {
      amount: cart.total_price,
      currency: "PLN",
      express: false,
      iban: "94132015372252938930000001",
      name: "TIPLAST Iński Tomasz"
    }

    // COD wymaga ubezpieczenia → dodajemy je TYLKO wtedy
    additionalServices.additional_insurance = true
  }

  /**
   * 2️⃣ Payload do Furgonetki
   */
  const payload = {
    services: {
      service: service
    },
    package: {
      pickup: {
        street: "Papowo Biskupie 31",
        postcode: "86-221",
        city: "Papowo Biskupie",
        country_code: "PL"
      },
      receiver: {
        name: `${cart.firstname} ${cart.lastname}`,
        company: cart.company || "",
        street: cart.street,
        postcode: cart.zip,
        city: cart.city,
        country_code: cart.country,
        email: cart.email,
        phone: cart.phone
      },
      type: "package",
      parcels: parcels.map(p => ({
        width: p.width,
        depth: p.length,
        height: p.height,
        weight: p.weight,
        value: cart.total_price / parcels.length
      })),
      ...(Object.keys(additionalServices).length && {
        additional_services: additionalServices
      })
    }
  }

  /**
   * 3️⃣ Wywołanie Furgonetki
   */
  const response = await $fetch(
    "https://api.furgonetka.pl/packages/calculate-price",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/vnd.furgonetka.v1+json"
      },
      body: payload
    }
  )

  /**
   * 4️⃣ TU DOPIERO budujemy metody wysyłki
   */
  const shippingMethods = response.services_prices
    .filter(r => r.available)
    .map(r => ({
      id: r.service_id,
      service: r.service,
      label: carriersConfig[r.service]?.label || r.service,
      type: carriersConfig[r.service]?.type || "courier",
      price_gross: r.service === 'inpost' ? r.pricing.price_gross + 3.44 : r.pricing.price_gross,
      price_net: r.service === 'inpost' ? r.pricing.price_net + 3.44 : r.pricing.price_net,
      currency: "PLN",
      breakdown: {
        base: r.pricing.price_net,
        fuel: r.pricing.details?.fuel_surcharge || 0,
        energy: r.pricing.details?.energy_fee || 0,
        insurance: r.pricing.details?.insurance || 0
      }
    }))

  return {
    response,
    methods: shippingMethods
  }
})
