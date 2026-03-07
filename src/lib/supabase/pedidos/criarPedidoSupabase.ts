import { clienteSupabaseAdmin } from '../clienteSupabase'
import type { NovoPedido, Pedido } from '@/types/pedido'

export async function criarPedidoSupabase(pedido: NovoPedido): Promise<Pedido> {
  const { data, error } = await clienteSupabaseAdmin
    .from('pedidos')
    .insert({ ...pedido, status: 'aguardando confirmação' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Pedido
}
