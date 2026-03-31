import { NextRequest, NextResponse } from 'next/server'
import { cancelarPedidosExpirados } from '@/lib/pedidos/cancelarPedidosExpirados'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    const totalCancelados = await cancelarPedidosExpirados()
    return NextResponse.json({ cancelados: totalCancelados })
  } catch {
    return NextResponse.json({ erro: 'Erro ao cancelar pedidos expirados' }, { status: 500 })
  }
}
