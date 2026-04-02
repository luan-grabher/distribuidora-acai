import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { Pedido } from '@/types/pedido'

const MINUTOS_ATE_EXPIRAR = 10

export async function listarPedidosAguardandoExpiradosSupabase(): Promise<Pedido[]> {
  const dataExpiracao = new Date(Date.now() - MINUTOS_ATE_EXPIRAR * 60 * 1000).toISOString()

  const { data, error } = await getClienteSupabaseAdmin()
    .from('pedidos')
    .select('*')
    .eq('status', 'aguardando confirmação')
    .lt('criado_em', dataExpiracao)

  if (error) throw new Error(error.message)
  return data as Pedido[]
}
