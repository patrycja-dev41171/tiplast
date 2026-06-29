import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const { invoice_number } = getQuery(event)
  if (!invoice_number) throw createError({ statusCode: 400, statusMessage: 'Brak numeru faktury.' })

  const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('invoice_number', invoice_number)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono faktury.' })

  return data
})
