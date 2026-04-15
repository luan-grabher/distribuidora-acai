import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { GastoPagamentoMes, UpsertGastoPagamentoMes } from '@/types/gastoPagamentoMes'

export async function upsertPagamentoMesSupabase(dados: UpsertGastoPagamentoMes): Promise<GastoPagamentoMes> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('gastos_pagamentos_mes')
    .upsert(dados, { onConflict: 'gasto_id,ano,mes' })
    .select()
    .single()

  if (error) throw new Error(`Falha ao criar ou atualizar pagamento mensal: ${error.message}`)
  return data as GastoPagamentoMes
}
