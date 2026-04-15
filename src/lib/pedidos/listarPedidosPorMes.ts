import { listarPedidosPorMesSupabase } from '@/lib/supabase/pedidos/listarPedidosPorMesSupabase'
import type { Pedido } from '@/types/pedido'

export async function listarPedidosPorMes(ano: number, mes: number): Promise<Pedido[]> {
  return listarPedidosPorMesSupabase(ano, mes)
}
