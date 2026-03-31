import { listarGastosSupabase } from '@/lib/supabase/gastos/listarGastosSupabase'
import type { Gasto } from '@/types/gasto'

export async function listarGastos(): Promise<Gasto[]> {
  return listarGastosSupabase()
}
