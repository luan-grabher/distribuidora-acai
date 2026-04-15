import type { Gasto } from '@/types/gasto'

export function gastoEstaAtivoNoMes(gasto: Gasto, ano: number, mesZeroIndexado: number): boolean {
  const inicio = new Date(gasto.data_inicio)
  const mesInicioAbsoluto = inicio.getFullYear() * 12 + inicio.getMonth()
  const mesAlvoAbsoluto = ano * 12 + mesZeroIndexado

  if (mesAlvoAbsoluto < mesInicioAbsoluto) return false

  if (gasto.tipo === 'unico') return mesInicioAbsoluto === mesAlvoAbsoluto

  if (gasto.tipo === 'parcelado') {
    const parcelaAtual = mesAlvoAbsoluto - mesInicioAbsoluto + 1
    return parcelaAtual <= (gasto.total_parcelas ?? 0)
  }

  return true
}

export function calcularTotalGastosDoMes(gastos: Gasto[], ano: number, mes: number): number {
  const mesZeroIndexado = mes - 1
  return gastos
    .filter((g) => gastoEstaAtivoNoMes(g, ano, mesZeroIndexado))
    .reduce((soma, g) => soma + g.valor, 0)
}
