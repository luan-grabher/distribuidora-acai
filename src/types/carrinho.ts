import type { Item } from './item'

export type ItemCarrinho = Pick<Item, 'id' | 'nome' | 'preco' | 'imagem_url'> & {
  quantidade: number
}
