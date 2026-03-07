import { listarPedidosSupabase } from '@/lib/supabase/pedidos/listarPedidosSupabase'
import type { Pedido } from '@/types/pedido'

export async function listarPedidos(): Promise<Pedido[]> {
  return listarPedidosSupabase()
}
