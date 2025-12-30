import { defineEventHandler, getQuery, createError } from "h3"
import { getFurgonetkaTokenFromCookie } from "~/server/utils/furgonetkaTokenCookie"

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const token = await getFurgonetkaTokenFromCookie(event)

    const {
        page = 1,
        search = "",
        ids = "",
        onlyDefaultPickup = true
    } = query

    const params = new URLSearchParams()

    if (page) params.append("page", String(page))
    if (search) params.append("search", String(search))
    if (ids) params.append("ids", String(ids))
    if (onlyDefaultPickup !== undefined) {
        params.append("onlyDefaultPickup", String(onlyDefaultPickup))
    }

    const url = `${config.furgonetkaApiUrl}/account/address-book?${params.toString()}`

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.furgonetka.v1+json"
        }
    })

    if (!res.ok) {
        const errorBody = await res.text()

        throw createError({
            statusCode: res.status,
            statusMessage: "Furgonetka API error",
            data: errorBody
        })
    }

    return await res.json()
})
