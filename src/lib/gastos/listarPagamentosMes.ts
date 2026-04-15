import { listarPagamentosMesSupabase } from '@/lib/supabase/gastos/listarPagamentosMesSupabase'
import type { GastoPagamentoMes } from '@/types/gastoPagamentoMes'

export async function listarPagamentosMes(ano: number, mes: number): Promise<GastoPagamentoMes[]> {
  return listarPagamentosMesSupabase(ano, mes)
}
