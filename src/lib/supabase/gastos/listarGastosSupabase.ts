import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { Gasto } from '@/types/gasto'

export async function listarGastosSupabase(): Promise<Gasto[]> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('gastos')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Gasto[]
}
