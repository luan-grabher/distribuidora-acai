import { logoutSupabase } from '@/lib/supabase/auth/logoutSupabase'

export async function logout(): Promise<void> {
  return logoutSupabase()
}
