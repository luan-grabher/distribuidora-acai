import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { NovoPedido, Pedido } from '@/types/pedido'

export async function criarPedidoSupabase(pedido: NovoPedido): Promise<Pedido> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('pedidos')
    .insert({ ...pedido, status: pedido.status ?? 'concluído' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Pedido
}
