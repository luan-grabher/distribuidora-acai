import { NextRequest, NextResponse } from 'next/server'
import { listarPedidos } from '@/lib/pedidos/listarPedidos'
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
    const pedidos = await listarPedidos()
    return NextResponse.json(pedidos)
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar pedidos' }, { status: 500 })
  }
}
