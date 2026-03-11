import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { EdicaoPedido, Pedido } from '@/types/pedido'

export async function editarPedidoSupabase(id: string, dados: EdicaoPedido): Promise<Pedido> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('pedidos')
    .update(dados)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Pedido
}
