import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { Pedido } from '@/types/pedido'
import { statusPedidoConsideradoVenda } from '@/types/pedido'

export async function listarPedidosPorMesSupabase(ano: number, mes: number): Promise<Pedido[]> {
  const inicioDoMes = new Date(ano, mes - 1, 1).toISOString()
  const fimDoMes = new Date(ano, mes, 1).toISOString()

  const { data, error } = await getClienteSupabaseAdmin()
    .from('pedidos')
    .select('*')
    .gte('criado_em', inicioDoMes)
    .lt('criado_em', fimDoMes)
    .in('status', statusPedidoConsideradoVenda)
    .order('criado_em', { ascending: true })

  if (error) throw new Error(error.message)
  return data as Pedido[]
}
