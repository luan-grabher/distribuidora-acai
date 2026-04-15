'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { GastoPagamentoMes } from '@/types/gastoPagamentoMes'

export function useGastosPagamentosMes(ano: number, mes: number) {
  const [pagamentos, setPagamentos] = useState<Record<string, 'pendente' | 'pago'>>({})
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  const redirecionarParaLoginSeNaoAutorizado = useCallback((status: number) => {
    if (status === 401) router.push('/admin/login')
  }, [router])

  const buscarPagamentos = useCallback(async () => {
    setCarregando(true)
    try {
      const resposta = await fetch(`/api/admin/gastos/pagamentos-mes?ano=${ano}&mes=${mes}`)
      if (!resposta.ok) {
        redirecionarParaLoginSeNaoAutorizado(resposta.status)
        return
      }
      const dados: GastoPagamentoMes[] = await resposta.json()
      const mapa: Record<string, 'pendente' | 'pago'> = {}
      dados.forEach((p) => { mapa[p.gasto_id] = p.status })
      setPagamentos(mapa)
    } finally {
      setCarregando(false)
    }
  }, [ano, mes, redirecionarParaLoginSeNaoAutorizado])

  useEffect(() => {
    buscarPagamentos()
  }, [buscarPagamentos])

  const alterarStatusMes = useCallback(async (gastoId: string, novoStatus: 'pendente' | 'pago') => {
    const resposta = await fetch(`/api/admin/gastos/${gastoId}/pagamento-mes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ano, mes, status: novoStatus }),
    })
    redirecionarParaLoginSeNaoAutorizado(resposta.status)
    if (!resposta.ok) throw new Error(`Erro ao atualizar status do mês (HTTP ${resposta.status})`)
    setPagamentos((anterior) => ({ ...anterior, [gastoId]: novoStatus }))
  }, [ano, mes, redirecionarParaLoginSeNaoAutorizado])

  return { pagamentos, carregando, alterarStatusMes }
}
