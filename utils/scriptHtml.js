export default function stripHtml(html) {
    return html
        ?.replace(/<[^>]+>/g, '')
        ?.replace(/\s+/g, ' ')
        ?.trim()
}
