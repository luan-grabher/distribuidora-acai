import { listarPedidosMesAtualSupabase } from '@/lib/supabase/pedidos/listarPedidosMesAtualSupabase'
import type { Pedido } from '@/types/pedido'

export async function listarPedidosMesAtual(): Promise<Pedido[]> {
  return listarPedidosMesAtualSupabase()
}
