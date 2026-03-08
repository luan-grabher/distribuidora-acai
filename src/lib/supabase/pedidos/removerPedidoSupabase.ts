import { clienteSupabaseAdmin } from '../clienteSupabase'

export async function removerPedidoSupabase(id: string): Promise<void> {
  const { error } = await clienteSupabaseAdmin
    .from('pedidos')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Falha ao remover pedido: ${error.message}`)
}
