import { NextRequest, NextResponse } from 'next/server'
import { criarPedido } from '@/lib/pedidos/criarPedido'
import type { NovoPedido } from '@/types/pedido'

export async function POST(request: NextRequest) {
  try {
    const corpo: NovoPedido = await request.json()
    const pedido = await criarPedido(corpo)
    return NextResponse.json(pedido, { status: 201 })
  } catch {
    return NextResponse.json({ erro: 'Erro ao criar pedido' }, { status: 500 })
  }
}
