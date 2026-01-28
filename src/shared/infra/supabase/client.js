import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const anonClient = createClient(supabaseUrl, supabaseKey)
export const adminClient = createClient(supabaseUrl, supabaseServiceKey,{
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
