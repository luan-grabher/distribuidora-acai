import { NextRequest, NextResponse } from 'next/server'
import { listarGastos } from '@/lib/gastos/listarGastos'
import { criarGasto } from '@/lib/gastos/criarGasto'
import { verificarSessao } from '@/lib/auth/verificarSessao'
import type { NovoGasto } from '@/types/gasto'

async function autenticarAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null
  return verificarSessao(token)
}

export async function GET(request: NextRequest) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const gastos = await listarGastos()
    return NextResponse.json(gastos)
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar gastos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const corpo: NovoGasto = await request.json()
    const gasto = await criarGasto(corpo)
    return NextResponse.json(gasto, { status: 201 })
  } catch {
    return NextResponse.json({ erro: 'Erro ao criar gasto' }, { status: 500 })
  }
}
