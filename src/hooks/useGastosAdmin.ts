'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Gasto, NovoGasto, EdicaoGasto } from '@/types/gasto'

export function useGastosAdmin() {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const router = useRouter()

  const redirecionarParaLoginSeNaoAutorizado = useCallback((status: number) => {
    if (status === 401) router.push('/admin/login')
  }, [router])

  const buscarGastos = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await fetch('/api/admin/gastos')
      if (!resposta.ok) {
        redirecionarParaLoginSeNaoAutorizado(resposta.status)
        throw new Error('Erro ao buscar gastos')
      }
      const dados = await resposta.json()
      setGastos(dados)
    } catch {
      setErro('Erro ao carregar gastos')
    } finally {
      setCarregando(false)
    }
  }, [redirecionarParaLoginSeNaoAutorizado])

  useEffect(() => {
    buscarGastos()
  }, [buscarGastos])

  const criarGasto = useCallback(async (gasto: NovoGasto) => {
    const resposta = await fetch('/api/admin/gastos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gasto),
    })
    redirecionarParaLoginSeNaoAutorizado(resposta.status)
    if (!resposta.ok) throw new Error('Erro ao criar gasto')
    await buscarGastos()
  }, [buscarGastos, redirecionarParaLoginSeNaoAutorizado])

  const atualizarGasto = useCallback(async (id: string, dados: EdicaoGasto) => {
    const resposta = await fetch(`/api/admin/gastos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
    redirecionarParaLoginSeNaoAutorizado(resposta.status)
    if (!resposta.ok) throw new Error('Erro ao atualizar gasto')
    await buscarGastos()
  }, [buscarGastos, redirecionarParaLoginSeNaoAutorizado])

  const excluirGasto = useCallback(async (id: string) => {
    const resposta = await fetch(`/api/admin/gastos/${id}`, { method: 'DELETE' })
    redirecionarParaLoginSeNaoAutorizado(resposta.status)
    if (!resposta.ok) throw new Error('Erro ao excluir gasto')
    await buscarGastos()
  }, [buscarGastos, redirecionarParaLoginSeNaoAutorizado])

  return { gastos, carregando, erro, criarGasto, atualizarGasto, excluirGasto }
}
