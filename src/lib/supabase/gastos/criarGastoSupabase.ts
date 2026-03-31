import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { NovoGasto, Gasto } from '@/types/gasto'

export async function criarGastoSupabase(gasto: NovoGasto): Promise<Gasto> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('gastos')
    .insert(gasto)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Gasto
}
