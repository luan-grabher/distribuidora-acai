export type Item = {
  id: string
  nome: string
  descricao: string
  imagem_url: string
  preco: number
  estoque: number
  ativo: boolean
  criado_em: string
}

export type NovoItem = Omit<Item, 'id' | 'criado_em'>

export type EdicaoItem = Partial<NovoItem>
