import { verificarSessaoSupabase } from '@/lib/supabase/auth/verificarSessaoSupabase'

export async function verificarSessao(token: string) {
  return verificarSessaoSupabase(token)
}
