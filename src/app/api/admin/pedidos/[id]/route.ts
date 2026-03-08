import { NextRequest, NextResponse } from 'next/server'
import { editarPedido } from '@/lib/pedidos/editarPedido'
import { removerPedido } from '@/lib/pedidos/removerPedido'
import { verificarSessao } from '@/lib/auth/verificarSessao'

async function autenticarAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null
  return verificarSessao(token)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const { id } = await params
    const corpo = await request.json()
    const pedido = await editarPedido(id, corpo)
    return NextResponse.json(pedido)
  } catch {
    return NextResponse.json({ erro: 'Erro ao editar pedido' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const { id } = await params
    await removerPedido(id)
    return NextResponse.json({ sucesso: true })
  } catch {
    return NextResponse.json({ erro: 'Erro ao remover pedido' }, { status: 500 })
  }
}
