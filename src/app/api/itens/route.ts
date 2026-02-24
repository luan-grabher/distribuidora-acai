import { NextResponse } from 'next/server'
import { listarItens } from '@/lib/itens/listarItens'

export async function GET() {
  try {
    const itens = await listarItens()
    return NextResponse.json(itens)
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar itens' }, { status: 500 })
  }
}
