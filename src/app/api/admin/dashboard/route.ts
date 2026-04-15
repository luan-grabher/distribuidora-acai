import { NextRequest, NextResponse } from 'next/server'
import { verificarSessao } from '@/lib/auth/verificarSessao'
import { listarPedidosPorMes } from '@/lib/pedidos/listarPedidosPorMes'
import { calcularDadosDashboard } from '@/lib/dashboard/calcularDadosDashboard'
import { executarCancelamentoPedidosSeNecessario } from '@/lib/pedidos/cancelarPedidosExpiradosEmSegundoPlano'
import { listarGastos } from '@/lib/gastos/listarGastos'
import { listarTodosItens } from '@/lib/itens/listarItens'

async function autenticarAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null
  return verificarSessao(token)
}

export async function GET(request: NextRequest) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const agora = new Date()
    const { searchParams } = new URL(request.url)
    const mes = parseInt(searchParams.get('mes') ?? String(agora.getMonth() + 1))
    const ano = parseInt(searchParams.get('ano') ?? String(agora.getFullYear()))

    executarCancelamentoPedidosSeNecessario()
    const [pedidos, gastos, itens] = await Promise.all([
      listarPedidosPorMes(ano, mes),
      listarGastos(),
      listarTodosItens(),
    ])
    const dados = calcularDadosDashboard(pedidos, itens, gastos, ano, mes)
    return NextResponse.json(dados)
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar dados do dashboard' }, { status: 500 })
  }
}
