import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { EdicaoGasto, Gasto } from '@/types/gasto'

export async function editarGastoSupabase(id: string, dados: EdicaoGasto): Promise<Gasto> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('gastos')
    .update(dados)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Gasto
}
