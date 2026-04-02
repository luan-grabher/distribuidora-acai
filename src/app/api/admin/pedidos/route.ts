import { NextRequest, NextResponse } from 'next/server'
import { listarPedidos } from '@/lib/pedidos/listarPedidos'
import { criarPedido } from '@/lib/pedidos/criarPedido'
import { verificarSessao } from '@/lib/auth/verificarSessao'
import { executarCancelamentoPedidosSeNecessario } from '@/lib/pedidos/cancelarPedidosExpiradosEmSegundoPlano'
import type { NovoPedido } from '@/types/pedido'

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
    const pedidos = await listarPedidos()
    return NextResponse.json(pedidos)
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar pedidos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const corpo: NovoPedido = await request.json()
    const pedido = await criarPedido(corpo)
    return NextResponse.json(pedido, { status: 201 })
  } catch {
    return NextResponse.json({ erro: 'Erro ao criar pedido' }, { status: 500 })
  }
}
