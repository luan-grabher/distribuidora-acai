import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { Pedido } from '@/types/pedido'

export async function listarPedidosSupabase(): Promise<Pedido[]> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('pedidos')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Pedido[]
}
