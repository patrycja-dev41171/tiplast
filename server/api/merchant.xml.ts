import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseServiceKey
  )

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq("hidden", false);


  if (error) {
    console.error('SUPABASE ERROR 👉', error)
    return {
      error: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    }
  }

  const getDetail = (p, name: string) =>
    p.technical_details?.find(d => d.name === name)?.value


  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
  <title>Tiplast.pl</title>
  <link>https://tiplast.pl</link>
  <description>Merchant feed</description>
  ${products.map(p => `
 <item>
  <g:id>${p.sku}</g:id>
  <g:title><![CDATA[${p.display_name}]]></g:title>
  <g:description><![CDATA[${p.short_description || p.display_name}]]></g:description>
  <g:link>https://tiplast.pl/produkt/${p.url}</g:link>
  <g:image_link>${p.photos?.[0]?.url}</g:image_link>
${(p.photos || []).slice(1).map(photo => `
  <g:additional_image_link>${photo.url}</g:additional_image_link>
`).join('')}
  <g:price>${p.prices.pln.base_price.replace(',', '.')} PLN</g:price>
  <g:availability>in stock</g:availability>
  <g:brand>Tiplast</g:brand>
  <g:condition>new</g:condition>
  <g:color>${getDetail(p, 'kolor')}</g:color>
<g:material>${getDetail(p, 'materiał')}</g:material>
  <g:product_type>Doniczki</g:product_type>
  <g:google_product_category><![CDATA[
Home & Garden > Lawn & Garden > Gardening > Plant Pots & Planters
]]></g:google_product_category>
  <g:shipping>
    <g:country>PL</g:country>
    <g:service>Kurier</g:service>
    <g:price>14.99 PLN</g:price>
  </g:shipping>
<g:identifier_exists>false</g:identifier_exists>
  <g:mpn>${p.sku}</g:mpn>
  <g:adult>no</g:adult>
</item>
  `).join('')}
</channel>
</rss>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 's-maxage=3600, stale-while-revalidate')

  return xml
})
