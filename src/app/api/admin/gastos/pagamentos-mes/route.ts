import { NextRequest, NextResponse } from 'next/server'
import { listarPagamentosMes } from '@/lib/gastos/listarPagamentosMes'
import { verificarSessao } from '@/lib/auth/verificarSessao'

async function autenticarAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null
  return verificarSessao(token)
}

export async function GET(request: NextRequest) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const ano = Number(searchParams.get('ano'))
  const mes = Number(searchParams.get('mes'))

  if (!ano || !mes) return NextResponse.json({ erro: 'Parâmetros ano e mes são obrigatórios' }, { status: 400 })

  try {
    const pagamentos = await listarPagamentosMes(ano, mes)
    return NextResponse.json(pagamentos)
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar pagamentos do mês' }, { status: 500 })
  }
}
