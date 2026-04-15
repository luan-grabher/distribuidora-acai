import type { Item } from '@/types/item'

export function normalizarCamposNumericosDoItem(item: Item): Item {
  const preco = parseFloat(String(item.preco))
  const promocao = item.promocao_ativa != null ? parseFloat(String(item.promocao_ativa)) : null
  const custo = item.custo != null ? parseFloat(String(item.custo)) : null
  return {
    ...item,
    preco: isNaN(preco) ? 0 : preco,
    promocao_ativa: promocao != null && !isNaN(promocao) ? promocao : null,
    custo: custo != null && !isNaN(custo) ? custo : null,
  }
}
