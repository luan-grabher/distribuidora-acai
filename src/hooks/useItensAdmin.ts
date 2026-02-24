'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Item, NovoItem, EdicaoItem } from '@/types/item'

export function useItensAdmin() {
  const [itens, setItens] = useState<Item[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const buscarItens = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await fetch('/api/admin/itens')
      if (!resposta.ok) throw new Error('Erro ao buscar itens')
      const dados = await resposta.json()
      setItens(dados)
    } catch {
      setErro('Erro ao carregar itens')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    buscarItens()
  }, [buscarItens])

  const criarItem = useCallback(async (item: NovoItem) => {
    const resposta = await fetch('/api/admin/itens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!resposta.ok) throw new Error('Erro ao criar item')
    await buscarItens()
  }, [buscarItens])

  const atualizarItem = useCallback(async (id: string, dados: EdicaoItem) => {
    const resposta = await fetch(`/api/admin/itens/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
    if (!resposta.ok) throw new Error('Erro ao atualizar item')
    await buscarItens()
  }, [buscarItens])

  const excluirItem = useCallback(async (id: string) => {
    const resposta = await fetch(`/api/admin/itens/${id}`, { method: 'DELETE' })
    if (!resposta.ok) throw new Error('Erro ao excluir item')
    await buscarItens()
  }, [buscarItens])

  return { itens, carregando, erro, criarItem, atualizarItem, excluirItem }
}
