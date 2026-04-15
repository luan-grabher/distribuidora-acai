'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { DadosDashboard } from '@/types/dashboard'

export function useDashboardAdmin() {
  const agora = new Date()
  const [mes, setMes] = useState(agora.getMonth() + 1)
  const [ano, setAno] = useState(agora.getFullYear())
  const [dados, setDados] = useState<DadosDashboard | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const router = useRouter()

  const buscarDados = useCallback(async (mesBusca: number, anoBusca: number) => {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await fetch(`/api/admin/dashboard?mes=${mesBusca}&ano=${anoBusca}`)
      if (!resposta.ok) {
        if (resposta.status === 401) router.push('/admin/login')
        throw new Error('Erro ao buscar dados do dashboard')
      }
      const dadosRecebidos = await resposta.json()
      setDados(dadosRecebidos)
    } catch {
      setErro('Erro ao carregar dados do dashboard')
    } finally {
      setCarregando(false)
    }
  }, [router])

  useEffect(() => {
    buscarDados(mes, ano)
  }, [buscarDados, mes, ano])

  const irParaMesAnterior = useCallback(() => {
    setMes((mesAtual) => {
      if (mesAtual === 1) {
        setAno((anoAtual) => anoAtual - 1)
        return 12
      }
      return mesAtual - 1
    })
  }, [])

  const irParaProximoMes = useCallback(() => {
    setMes((mesAtual) => {
      const anoParaVerificar = mesAtual === 12 ? ano + 1 : ano
      const proximoMes = mesAtual === 12 ? 1 : mesAtual + 1
      const estaNoFuturo =
        anoParaVerificar > agora.getFullYear() ||
        (anoParaVerificar === agora.getFullYear() && proximoMes > agora.getMonth() + 1)
      if (estaNoFuturo) return mesAtual
      if (mesAtual === 12) {
        setAno((anoAtual) => anoAtual + 1)
        return 1
      }
      return mesAtual + 1
    })
  }, [ano])

  const eMesAtual = mes === agora.getMonth() + 1 && ano === agora.getFullYear()

  return { dados, carregando, erro, mes, ano, eMesAtual, irParaMesAnterior, irParaProximoMes, recarregar: () => buscarDados(mes, ano) }
}
