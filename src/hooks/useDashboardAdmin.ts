'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { DadosDashboard } from '@/types/dashboard'

export function useDashboardAdmin() {
  const [dados, setDados] = useState<DadosDashboard | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const router = useRouter()

  const buscarDados = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await fetch('/api/admin/dashboard')
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
    buscarDados()
  }, [buscarDados])

  return { dados, carregando, erro, recarregar: buscarDados }
}
