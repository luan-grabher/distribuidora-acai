import { editarPedidoSupabase } from '@/lib/supabase/pedidos/editarPedidoSupabase'
import type { EdicaoPedido, Pedido } from '@/types/pedido'

export async function editarPedido(id: string, dados: EdicaoPedido): Promise<Pedido> {
  return editarPedidoSupabase(id, dados)
}
