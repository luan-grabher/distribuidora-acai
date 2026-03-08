export type FaturamentoDiario = {
  dia: number
  faturamento: number
}

export type ItemMaisVendido = {
  nome: string
  quantidade: number
  totalFaturado: number
  projecaoQuantidade: number
  projecaoTotalFaturado: number
}

export type DadosDashboard = {
  totalFaturadoNoMes: number
  mediaFaturamentoPorDia: number
  projecaoFaturamentoMes: number
  diasDecorridos: number
  diasRestantes: number
  diasNoMes: number
  faturamentoPorDia: FaturamentoDiario[]
  itensMaisVendidos: ItemMaisVendido[]
}
