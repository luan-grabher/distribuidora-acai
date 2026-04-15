export type Item = {
  id: string
  nome: string
  descricao: string
  imagem_url: string
  preco: number
  custo: number | null
  promocao_ativa: number | null
  estoque: number
  ativo: boolean
  criado_em: string
  codigo_barras: string | null
}

export type NovoItem = Omit<Item, 'id' | 'criado_em'>

export type EdicaoItem = Partial<NovoItem>
