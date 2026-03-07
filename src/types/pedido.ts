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
  criado_em: string
}

export type NovoPedido = Omit<Pedido, 'id' | 'criado_em' | 'status'>

export type EdicaoPedido = {
  status: StatusPedido
}
