import { NextRequest, NextResponse } from 'next/server'
import { editarGasto } from '@/lib/gastos/editarGasto'
import { removerGasto } from '@/lib/gastos/removerGasto'
import { verificarSessao } from '@/lib/auth/verificarSessao'
import type { EdicaoGasto } from '@/types/gasto'

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
    const corpo: EdicaoGasto = await request.json()
    const gasto = await editarGasto(id, corpo)
    return NextResponse.json(gasto)
  } catch {
    return NextResponse.json({ erro: 'Erro ao editar gasto' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const { id } = await params
    await removerGasto(id)
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ erro: 'Erro ao remover gasto' }, { status: 500 })
  }
}
