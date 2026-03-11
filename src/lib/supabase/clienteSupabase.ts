import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _adminClient: SupabaseClient | null = null
let _anonClient: SupabaseClient | null = null

export function getClienteSupabaseAdmin(): SupabaseClient {
    if (!_adminClient) {
        const url = process.env.SUPABASE_URL
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!url) throw new Error('SUPABASE_URL não configurada')
        if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada')
        _adminClient = createClient(url, key)
    }
    return _adminClient
}

export function getClienteSupabase(): SupabaseClient {
    if (!_anonClient) {
        const url = process.env.SUPABASE_URL
        const key = process.env.SUPABASE_ANON_KEY
        if (!url) throw new Error('SUPABASE_URL não configurada')
        if (!key) throw new Error('SUPABASE_ANON_KEY não configurada')
        _anonClient = createClient(url, key)
    }
    return _anonClient
}
