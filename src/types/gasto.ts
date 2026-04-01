export type TipoGasto = 'unico' | 'recorrente' | 'parcelado'

export interface Gasto {
  id: string
  descricao: string
  valor: number
  tipo: TipoGasto
  categoria: string | null
  data_inicio: string
  total_parcelas: number | null
  numero_parcela?: number | null
  status: 'pendente' | 'pago'
  criado_em: string
}

export interface NovoGasto {
  descricao: string
  valor: number
  tipo: TipoGasto
  categoria?: string | null
  data_inicio: string
  total_parcelas?: number | null
  numero_parcela?: number | null
  status?: 'pendente' | 'pago'
}

export interface EdicaoGasto {
  descricao?: string
  valor?: number
  tipo?: TipoGasto
  categoria?: string | null
  data_inicio?: string
  total_parcelas?: number | null
  numero_parcela?: number | null
  status?: 'pendente' | 'pago'
}
