import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    order_id,
    order_number,
    invoice_number,
    type = 'invoice',
    original_invoice_number = null,
    items = null,
    shipping = null,
    notes = null,
  } = body

  const config = useRuntimeConfig()

  if (!order_id || !invoice_number) {
    throw createError({ statusCode: 400, statusMessage: 'Brak wymaganych pól.' })
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  // Unikalność numeru
  const { data: existing } = await supabase
    .from('invoices')
    .select('id')
    .eq('invoice_number', invoice_number)
    .maybeSingle()

  if (existing) {
    throw createError({ statusCode: 409, statusMessage: `Dokument o numerze ${invoice_number} już istnieje.` })
  }

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      order_id,
      order_number,
      invoice_number,
      type,
      original_invoice_number,
      issued_by: 'Tomasz Iński',
      status: 'issued',
      items,
      shipping,
      notes,
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  // Zapisz numer faktury / korekty na zamówieniu
  const orderField = type === 'credit_memo' ? 'credit_memo_number' : 'invoice_number'
  await supabase.from('orders').update({ [orderField]: invoice_number }).eq('order_id', order_id)

  return { ok: true, invoice: data }
})
