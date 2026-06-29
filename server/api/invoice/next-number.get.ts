import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query  = getQuery(event)
  const type   = (query.type as string) === 'credit_memo' ? 'credit_memo' : 'invoice'

  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  const now   = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year  = now.getFullYear()
  const suffix = `/${month}/${year}`

  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('type', type)
    .like('invoice_number', `%${suffix}`)

  const seq    = String((count ?? 0) + 1).padStart(2, '0')
  const number = type === 'credit_memo' ? `KOR/${seq}${suffix}` : `${seq}${suffix}`

  return { invoice_number: number }
})
