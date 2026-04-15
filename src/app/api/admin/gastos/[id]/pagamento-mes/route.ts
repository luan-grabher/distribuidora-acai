import { NextRequest, NextResponse } from 'next/server'
import { upsertPagamentoMes } from '@/lib/gastos/upsertPagamentoMes'
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
    const { ano, mes, status } = await request.json()
    const pagamento = await upsertPagamentoMes({ gasto_id: id, ano, mes, status })
    return NextResponse.json(pagamento)
  } catch {
    return NextResponse.json({ erro: 'Erro ao atualizar pagamento do mês' }, { status: 500 })
  }
}
