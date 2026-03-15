import type { Pedido } from '@/types/pedido'
import type { DadosDashboard, FaturamentoDiario, ItemMaisVendido, VendaPorFormaPagamento } from '@/types/dashboard'

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
  const quantidadePorId: Record<string, number> = {}
  const totalFaturadoPorId: Record<string, number> = {}
  const nomePorId: Record<string, string> = {}

  for (const pedido of pedidos) {
    for (const item of pedido.itens) {
      if (!quantidadePorId[item.id]) {
        quantidadePorId[item.id] = 0
        totalFaturadoPorId[item.id] = 0
      }
      quantidadePorId[item.id] += item.quantidade
      totalFaturadoPorId[item.id] += item.subtotal
      nomePorId[item.id] = item.nome
    }
  }

  const fatorProjecao = diasDecorridos > 0 ? diasNoMes / diasDecorridos : 1

  return Object.keys(quantidadePorId)
    .map((id) => ({
      nome: nomePorId[id],
      quantidade: quantidadePorId[id],
      totalFaturado: totalFaturadoPorId[id],
      projecaoQuantidade: Math.round(quantidadePorId[id] * fatorProjecao),
      projecaoTotalFaturado: totalFaturadoPorId[id] * fatorProjecao,
    }))
    .sort((a, b) => b.quantidade - a.quantidade)
}

function calcularVendasPorFormaPagamento(pedidos: Pedido[]): VendaPorFormaPagamento[] {
  const agrupado: Record<string, { quantidade: number; total: number }> = {}

  for (const pedido of pedidos) {
    const chave = pedido.forma_pagamento ?? 'não informado'
    if (!agrupado[chave]) {
      agrupado[chave] = { quantidade: 0, total: 0 }
    }
    agrupado[chave].quantidade += 1
    agrupado[chave].total += pedido.total
  }

  return Object.entries(agrupado)
    .map(([formaPagamento, { quantidade, total }]) => ({ formaPagamento, quantidade, total }))
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
    vendasPorFormaPagamento: calcularVendasPorFormaPagamento(pedidos),
  }
}
