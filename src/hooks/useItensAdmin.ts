'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Item, NovoItem, EdicaoItem } from '@/types/item'

export function useItensAdmin() {
  const [itens, setItens] = useState<Item[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const router = useRouter()

  const redirecionarParaLoginSeNaoAutorizado = useCallback((status: number) => {
    if (status === 401) router.push('/admin/login')
  }, [router])

  const buscarItens = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await fetch('/api/admin/itens')
      if (!resposta.ok) {
        redirecionarParaLoginSeNaoAutorizado(resposta.status)
        throw new Error('Erro ao buscar itens')
      }
      const dados = await resposta.json()
      setItens(dados)
    } catch {
      setErro('Erro ao carregar itens')
    } finally {
      setCarregando(false)
    }
  }, [redirecionarParaLoginSeNaoAutorizado])

  useEffect(() => {
    buscarItens()
  }, [buscarItens])

  const criarItem = useCallback(async (item: NovoItem) => {
    const resposta = await fetch('/api/admin/itens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    redirecionarParaLoginSeNaoAutorizado(resposta.status)
    if (!resposta.ok) throw new Error('Erro ao criar item')
    await buscarItens()
  }, [buscarItens, redirecionarParaLoginSeNaoAutorizado])

  const atualizarItem = useCallback(async (id: string, dados: EdicaoItem) => {
    const resposta = await fetch(`/api/admin/itens/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
    redirecionarParaLoginSeNaoAutorizado(resposta.status)
    if (!resposta.ok) throw new Error('Erro ao atualizar item')
    await buscarItens()
  }, [buscarItens, redirecionarParaLoginSeNaoAutorizado])

  const excluirItem = useCallback(async (id: string) => {
    const resposta = await fetch(`/api/admin/itens/${id}`, { method: 'DELETE' })
    redirecionarParaLoginSeNaoAutorizado(resposta.status)
    if (!resposta.ok) throw new Error('Erro ao excluir item')
    await buscarItens()
  }, [buscarItens, redirecionarParaLoginSeNaoAutorizado])

  return { itens, carregando, erro, criarItem, atualizarItem, excluirItem }
}
