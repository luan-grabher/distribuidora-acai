import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) throw new Error('SUPABASE_URL não configurada')
if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada')
if (!supabaseAnonKey) throw new Error('SUPABASE_ANON_KEY não configurada')

export const clienteSupabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const clienteSupabase = createClient(supabaseUrl, supabaseAnonKey)
