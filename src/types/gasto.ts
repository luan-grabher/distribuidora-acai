export type TipoGasto = 'unico' | 'recorrente' | 'parcelado'

export interface Gasto {
  id: string
  descricao: string
  valor: number
  tipo: TipoGasto
  categoria: string | null
  data_inicio: string
  total_parcelas: number | null
  ativo: boolean
  criado_em: string
}

export interface NovoGasto {
  descricao: string
  valor: number
  tipo: TipoGasto
  categoria?: string | null
  data_inicio: string
  total_parcelas?: number | null
  ativo?: boolean
}

export interface EdicaoGasto {
  descricao?: string
  valor?: number
  tipo?: TipoGasto
  categoria?: string | null
  data_inicio?: string
  total_parcelas?: number | null
  ativo?: boolean
}
