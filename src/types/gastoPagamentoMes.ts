export interface GastoPagamentoMes {
  id: string
  gasto_id: string
  ano: number
  mes: number
  status: 'pendente' | 'pago'
  criado_em: string
}

export interface UpsertGastoPagamentoMes {
  gasto_id: string
  ano: number
  mes: number
  status: 'pendente' | 'pago'
}
