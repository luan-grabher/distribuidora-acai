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

export type VendaPorFormaPagamento = {
  formaPagamento: string
  quantidade: number
  total: number
}

export type DadosDashboard = {
  mes: number
  ano: number
  totalFaturadoNoMes: number
  mediaFaturamentoPorDia: number
  projecaoFaturamentoMes: number
  lucroAtual: number
  mediaDeLucroPorDia: number
  projecaoLucroMes: number
  totalGastosNoMes: number
  diasDecorridos: number
  diasRestantes: number
  diasNoMes: number
  faturamentoPorDia: FaturamentoDiario[]
  itensMaisVendidos: ItemMaisVendido[]
  vendasPorFormaPagamento: VendaPorFormaPagamento[]
}
