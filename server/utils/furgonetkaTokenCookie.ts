import {
    getCookie,
    setCookie,
    deleteCookie,
    createError,
    H3Event
} from "h3"

const TOKEN_COOKIE = "furgonetka_token"
const EXP_COOKIE = "furgonetka_token_exp"

export const getFurgonetkaTokenFromCookie = async (event: H3Event) => {
    const token = getCookie(event, TOKEN_COOKIE)
    const exp = getCookie(event, EXP_COOKIE)

    // ✅ token istnieje i nie wygasł
    if (token && exp && Date.now() < Number(exp)) {
        return token
    }

    // 🔄 brak lub wygasł → pobieramy nowy
    const res = await $fetch<{
        access_token: string
        expires_in: number
    }>("/api/furgonetka/oauth/token", {
        method: "POST"
    })

    if (!res?.access_token) {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to obtain Furgonetka token"
        })
    }

    const expiresAt = Date.now() + (res.expires_in - 60) * 1000

    // 🍪 zapis cookies
    setCookie(event, TOKEN_COOKIE, res.access_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    })

    setCookie(event, EXP_COOKIE, String(expiresAt), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    })

    return res.access_token
}
