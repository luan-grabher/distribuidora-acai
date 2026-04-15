import type { Item } from '@/types/item'
import type { ItemPedido } from '@/types/pedido'

export function calcularLucroItem(item: Item | null | undefined, itemPedido: ItemPedido): number {
  const custoUnitario = item?.custo ?? 0
  return (itemPedido.preco - custoUnitario) * itemPedido.quantidade
}
