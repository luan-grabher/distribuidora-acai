import { criarPedidoSupabase } from '@/lib/supabase/pedidos/criarPedidoSupabase'
import type { NovoPedido, Pedido } from '@/types/pedido'

export async function criarPedido(pedido: NovoPedido): Promise<Pedido> {
  return criarPedidoSupabase(pedido)
}
