import { removerPedidoSupabase } from '@/lib/supabase/pedidos/removerPedidoSupabase'

export async function removerPedido(id: string): Promise<void> {
  return removerPedidoSupabase(id)
}
