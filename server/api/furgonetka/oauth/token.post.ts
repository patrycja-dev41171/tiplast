import { defineEventHandler, createError } from "h3"

export default defineEventHandler(async () => {
    const config = useRuntimeConfig()

    const auth = Buffer.from(
        `${config.furgonetkaClientId}:${config.furgonetkaClientSecret}`
    ).toString("base64")

    const body = new URLSearchParams({
        grant_type: "password",
        scope: "api",
        username: config.furgonetkaUsername,
        password: config.furgonetkaPassword
    })

    const res = await fetch(`${config.furgonetkaApiUrl}/oauth/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body
    })

    if (!res.ok) {
        const text = await res.text()
        throw createError({
            statusCode: res.status,
            statusMessage: "OAuth token error",
            data: text
        })
    }

    return await res.json()
})
