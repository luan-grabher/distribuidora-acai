import { listarPedidosAguardandoExpiradosSupabase } from '@/lib/supabase/pedidos/listarPedidosAguardandoExpiradosSupabase'
import { editarPedidoSupabase } from '@/lib/supabase/pedidos/editarPedidoSupabase'

export async function cancelarPedidosExpirados(): Promise<number> {
  const pedidosExpirados = await listarPedidosAguardandoExpiradosSupabase()

  const resultados = await Promise.allSettled(
    pedidosExpirados.map((pedido) => editarPedidoSupabase(pedido.id, { status: 'cancelado' }))
  )

  const totalCancelados = resultados.filter((r) => r.status === 'fulfilled').length
  return totalCancelados
}
