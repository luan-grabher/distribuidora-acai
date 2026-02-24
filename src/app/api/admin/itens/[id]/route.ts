import { NextRequest, NextResponse } from 'next/server'
import { editarItem } from '@/lib/itens/editarItem'
import { removerItem } from '@/lib/itens/removerItem'
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
    const item = await editarItem(id, corpo)
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ erro: 'Erro ao editar item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const { id } = await params
    await removerItem(id)
    return NextResponse.json({ sucesso: true })
  } catch {
    return NextResponse.json({ erro: 'Erro ao remover item' }, { status: 500 })
  }
}
