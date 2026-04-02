import { after } from 'next/server'
import { cancelarPedidosExpirados } from '@/lib/pedidos/cancelarPedidosExpirados'

const CINCO_MINUTOS_EM_MS = 5 * 60 * 1000

let timestampUltimaExecucaoCancelamentoPedidos: number | null = null

export function executarCancelamentoPedidosSeNecessario(): void {
  const agora = Date.now()
  const deveExecutar =
    timestampUltimaExecucaoCancelamentoPedidos === null ||
    agora - timestampUltimaExecucaoCancelamentoPedidos >= CINCO_MINUTOS_EM_MS

  if (!deveExecutar) return

  timestampUltimaExecucaoCancelamentoPedidos = agora
  after(() => cancelarPedidosExpirados().catch(() => {}))
}
