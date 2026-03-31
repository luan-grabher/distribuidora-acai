import { editarGastoSupabase } from '@/lib/supabase/gastos/editarGastoSupabase'
import type { EdicaoGasto, Gasto } from '@/types/gasto'

export async function editarGasto(id: string, dados: EdicaoGasto): Promise<Gasto> {
  return editarGastoSupabase(id, dados)
}
