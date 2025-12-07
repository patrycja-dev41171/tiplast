// plugins/supabase.server.ts
import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const supabaseServer = createClient(
    config.supabaseUrl,
    config.supabaseServiceKey,
    {
      auth: {
        persistSession: false
      }
    }
  )

  return {
    provide: {
      supabase: supabaseServer
    }
  }
})
