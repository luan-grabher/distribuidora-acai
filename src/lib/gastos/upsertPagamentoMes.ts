import { upsertPagamentoMesSupabase } from '@/lib/supabase/gastos/upsertPagamentoMesSupabase'
import type { GastoPagamentoMes, UpsertGastoPagamentoMes } from '@/types/gastoPagamentoMes'

export async function upsertPagamentoMes(dados: UpsertGastoPagamentoMes): Promise<GastoPagamentoMes> {
  return upsertPagamentoMesSupabase(dados)
}
