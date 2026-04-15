import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { GastoPagamentoMes } from '@/types/gastoPagamentoMes'

export async function listarPagamentosMesSupabase(ano: number, mes: number): Promise<GastoPagamentoMes[]> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('gastos_pagamentos_mes')
    .select('*')
    .eq('ano', ano)
    .eq('mes', mes)

  if (error) throw new Error(`Falha ao listar pagamentos do mês: ${error.message}`)
  return data as GastoPagamentoMes[]
}
