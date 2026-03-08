export type StatusPedido =
  | 'aguardando confirmação'
  | 'confirmado'
  | 'em preparo'
  | 'enviado'
  | 'entregue'
  | 'cancelado'

export const todosStatusPedido: StatusPedido[] = [
  'aguardando confirmação',
  'confirmado',
  'em preparo',
  'enviado',
  'entregue',
  'cancelado',
]

export type FormaPagamento =
  | 'dinheiro'
  | 'pix'
  | 'cartão de crédito'
  | 'cartão de débito'
  | 'boleto'
  | 'transferência bancária'

export const todasFormasPagamento: FormaPagamento[] = [
  'dinheiro',
  'pix',
  'cartão de crédito',
  'cartão de débito',
  'boleto',
  'transferência bancária',
]

export type ItemPedido = {
  id: string
  nome: string
  preco: number
  quantidade: number
  subtotal: number
}

export type Pedido = {
  id: string
  itens: ItemPedido[]
  total: number
  status: StatusPedido
  forma_pagamento: FormaPagamento | null
  nome_cliente: string
  telefone_cliente: string
  criado_em: string
}

export type NovoPedido = Omit<Pedido, 'id' | 'status' | 'criado_em'> & { criado_em?: string }

export type EdicaoPedido = {
  status?: StatusPedido
  itens?: ItemPedido[]
  total?: number
  forma_pagamento?: FormaPagamento | null
}
