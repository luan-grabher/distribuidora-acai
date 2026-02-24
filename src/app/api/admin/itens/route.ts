import { NextRequest, NextResponse } from 'next/server'
import { listarTodosItens } from '@/lib/itens/listarItens'
import { adicionarItem } from '@/lib/itens/adicionarItem'
import { verificarSessao } from '@/lib/auth/verificarSessao'

async function autenticarAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null
  return verificarSessao(token)
}

export async function GET(request: NextRequest) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const itens = await listarTodosItens()
    return NextResponse.json(itens)
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar itens' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const corpo = await request.json()
    const item = await adicionarItem(corpo)
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ erro: 'Erro ao adicionar item' }, { status: 500 })
  }
}
