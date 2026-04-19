export type StatusPedido =
  | 'aguardando confirmação'
  | 'confirmado'
  | 'em preparo'
  | 'enviado'
  | 'entregue'
  | 'concluído'
  | 'cancelado'

export const todosStatusPedido: StatusPedido[] = [
  'aguardando confirmação',
  'confirmado',
  'em preparo',
  'enviado',
  'entregue',
  'concluído',
  'cancelado',
]

export const statusPedidoConsideradoVenda: StatusPedido[] = ['enviado', 'entregue', 'concluído']

export type FormaPagamento =
  | 'dinheiro'
  | 'pix'
  | 'cartão de crédito'
  | 'cartão de débito'

export const todasFormasPagamento: FormaPagamento[] = [
  'dinheiro',
  'pix',
  'cartão de crédito',
  'cartão de débito',
]

export type PagamentoParcial = {
  forma: FormaPagamento
  valor: number
}

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
  pagamentos: PagamentoParcial[]
  forma_pagamento: FormaPagamento | null
  nome_cliente: string
  telefone_cliente: string
  criado_em: string
  taxa_entrega: number
}

export type NovoPedido = Omit<Pedido, 'id' | 'status' | 'criado_em'> & { status?: StatusPedido; criado_em?: string }

export type EdicaoPedido = {
  status?: StatusPedido
  itens?: ItemPedido[]
  total?: number
  pagamentos?: PagamentoParcial[]
  forma_pagamento?: FormaPagamento | null
  taxa_entrega?: number
  criado_em?: string
  nome_cliente?: string
  telefone_cliente?: string
}

export const TAXA_ENTREGA_PADRAO = 7
