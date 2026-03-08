import { clienteSupabaseAdmin } from '../clienteSupabase'
import type { Pedido } from '@/types/pedido'

export async function listarPedidosMesAtualSupabase(): Promise<Pedido[]> {
  const agora = new Date()
  const inicioDoMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString()
  const fimDoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 1).toISOString()

  const { data, error } = await clienteSupabaseAdmin
    .from('pedidos')
    .select('*')
    .gte('criado_em', inicioDoMes)
    .lt('criado_em', fimDoMes)
    .neq('status', 'cancelado')
    .order('criado_em', { ascending: true })

  if (error) throw new Error(error.message)
  return data as Pedido[]
}
