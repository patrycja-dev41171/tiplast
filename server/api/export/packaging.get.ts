import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  const { data, error } = await supabase
    .from('packaging_options')
    .select(`
      id,
      quantity_per_cartoon,
      max_weight,
      instructions,
      products ( id, sku, display_name ),
      cartoons ( id, sku, length, width, height )
    `)
    .order('id')

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return data
})
