import { removerGastoSupabase } from '@/lib/supabase/gastos/removerGastoSupabase'

export async function removerGasto(id: string): Promise<void> {
  return removerGastoSupabase(id)
}
