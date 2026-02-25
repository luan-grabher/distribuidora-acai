import type { ItemCarrinho } from '@/types/carrinho'
 
function escapeWhatsAppMarkdown(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/([*_~`])/g, '\\$1')
}

export function gerarMensagemPedido(itens: ItemCarrinho[]): string {
  const linhasItens = itens
    .map((item) => {
      const nome = escapeWhatsAppMarkdown(item.nome)
      const precoUnitario = `R$ ${item.preco.toFixed(2).replace('.', ',')}`
      const subtotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',')
      return `• ${item.quantidade}x ${nome} (${precoUnitario}) — *R$ ${subtotal}*`
    })
    .join('\n')

  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0)
  const totalFormatado = total.toFixed(2).replace('.', ',')

  return `Olá! Gostaria de fazer um pedido:\n\n${linhasItens}\n\n*Total: R$ ${totalFormatado}*\n\nPor favor, confirme a disponibilidade e o prazo de entrega.`
}

export function gerarUrlWhatsapp(numeroCelular: string, mensagem: string): string {
  const numeroLimpo = numeroCelular.replace(/\D/g, '')
  return `https://api.whatsapp.com/send/?phone=${numeroLimpo}&app_absent=1&text=${encodeURIComponent(mensagem)}`
}
