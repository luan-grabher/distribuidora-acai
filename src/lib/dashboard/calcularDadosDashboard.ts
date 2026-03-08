import type { Pedido } from '@/types/pedido'
import type { DadosDashboard, FaturamentoDiario, ItemMaisVendido } from '@/types/dashboard'

function obterDiasDoMes(ano: number, mes: number): number {
  return new Date(ano, mes + 1, 0).getDate()
}

function calcularFaturamentoPorDia(pedidos: Pedido[], diasDecorridos: number): FaturamentoDiario[] {
  const faturamentoPorDia: Record<number, number> = {}

  for (let dia = 1; dia <= diasDecorridos; dia++) {
    faturamentoPorDia[dia] = 0
  }

  for (const pedido of pedidos) {
    const dia = new Date(pedido.criado_em).getDate()
    if (faturamentoPorDia[dia] !== undefined) {
      faturamentoPorDia[dia] += pedido.total
    }
  }

  return Object.entries(faturamentoPorDia).map(([dia, faturamento]) => ({
    dia: Number(dia),
    faturamento,
  }))
}

function calcularItensMaisVendidos(pedidos: Pedido[], diasDecorridos: number, diasNoMes: number): ItemMaisVendido[] {
  const quantidadePorItem: Record<string, number> = {}
  const totalFaturadoPorItem: Record<string, number> = {}

  for (const pedido of pedidos) {
    for (const item of pedido.itens) {
      if (!quantidadePorItem[item.nome]) {
        quantidadePorItem[item.nome] = 0
        totalFaturadoPorItem[item.nome] = 0
      }
      quantidadePorItem[item.nome] += item.quantidade
      totalFaturadoPorItem[item.nome] += item.subtotal
    }
  }

  const fatorProjecao = diasDecorridos > 0 ? diasNoMes / diasDecorridos : 1

  return Object.keys(quantidadePorItem)
    .map((nome) => ({
      nome,
      quantidade: quantidadePorItem[nome],
      totalFaturado: totalFaturadoPorItem[nome],
      projecaoQuantidade: Math.round(quantidadePorItem[nome] * fatorProjecao),
      projecaoTotalFaturado: totalFaturadoPorItem[nome] * fatorProjecao,
    }))
    .sort((a, b) => b.quantidade - a.quantidade)
}

export function calcularDadosDashboard(pedidos: Pedido[]): DadosDashboard {
  const agora = new Date()
  const diasNoMes = obterDiasDoMes(agora.getFullYear(), agora.getMonth())
  const diasDecorridos = agora.getDate()
  const diasRestantes = diasNoMes - diasDecorridos

  const totalFaturadoNoMes = pedidos.reduce((soma, pedido) => soma + pedido.total, 0)
  const mediaFaturamentoPorDia = diasDecorridos > 0 ? totalFaturadoNoMes / diasDecorridos : 0
  const projecaoFaturamentoMes = totalFaturadoNoMes + diasRestantes * mediaFaturamentoPorDia

  return {
    totalFaturadoNoMes,
    mediaFaturamentoPorDia,
    projecaoFaturamentoMes,
    diasDecorridos,
    diasRestantes,
    diasNoMes,
    faturamentoPorDia: calcularFaturamentoPorDia(pedidos, diasDecorridos),
    itensMaisVendidos: calcularItensMaisVendidos(pedidos, diasDecorridos, diasNoMes),
  }
}
