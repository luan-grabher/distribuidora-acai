import { NextRequest, NextResponse } from 'next/server'
import { verificarSessao } from '@/lib/auth/verificarSessao'
import { listarPedidosMesAtual } from '@/lib/pedidos/listarPedidosMesAtual'
import { calcularDadosDashboard } from '@/lib/dashboard/calcularDadosDashboard'
import { executarCancelamentoPedidosSeNecessario } from '@/lib/pedidos/cancelarPedidosExpiradosEmSegundoPlano'

async function autenticarAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null
  return verificarSessao(token)
}

export async function GET(request: NextRequest) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    executarCancelamentoPedidosSeNecessario()
    const pedidos = await listarPedidosMesAtual()
    const dados = calcularDadosDashboard(pedidos)
    return NextResponse.json(dados)
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar dados do dashboard' }, { status: 500 })
  }
}
