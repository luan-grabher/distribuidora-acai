import { loginSupabase } from '@/lib/supabase/auth/loginSupabase'

export async function login(email: string, senha: string) {
  return loginSupabase(email, senha)
}
