import type { ItemCarrinho } from '@/types/carrinho'

export function gerarMensagemPedido(itens: ItemCarrinho[]): string {
  const linhasItens = itens
    .map((item) => `• ${item.quantidade}x ${item.nome} — R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}`)
    .join('\n')

  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0)

  return `Olá! Gostaria de fazer um pedido:\n\n${linhasItens}\n\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\nPor favor, confirme a disponibilidade e o prazo de entrega.`
}

export function gerarUrlWhatsapp(numeroCelular: string, mensagem: string): string {
  const numeroLimpo = numeroCelular.replace(/\D/g, '')
  return `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`
}
