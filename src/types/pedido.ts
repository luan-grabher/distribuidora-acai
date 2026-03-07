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
  nome_cliente: string
  telefone_cliente: string
  criado_em: string
}

export type NovoPedido = Omit<Pedido, 'id' | 'status' | 'criado_em'> & { criado_em?: string }

export type EdicaoPedido = {
  status?: StatusPedido
  itens?: ItemPedido[]
  total?: number
}
