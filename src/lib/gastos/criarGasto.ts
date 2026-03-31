import { criarGastoSupabase } from '@/lib/supabase/gastos/criarGastoSupabase'
import type { NovoGasto, Gasto } from '@/types/gasto'

export async function criarGasto(gasto: NovoGasto): Promise<Gasto> {
  return criarGastoSupabase(gasto)
}
