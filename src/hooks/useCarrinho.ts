'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ItemCarrinho } from '@/types/carrinho'
import type { Item } from '@/types/item'

const CHAVE_LOCALSTORAGE = 'carrinho_miquinho'

export function useCarrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([])

  useEffect(() => {
    const salvo = localStorage.getItem(CHAVE_LOCALSTORAGE)
    if (salvo) {
      try {
        setItens(JSON.parse(salvo))
      } catch {
        setItens([])
      }
    }
  }, [])

  const salvarItens = useCallback((novosItens: ItemCarrinho[]) => {
    setItens(novosItens)
    localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(novosItens))
  }, [])

  const adicionarAoCarrinho = useCallback((item: Item) => {
    setItens((anterior) => {
      const existente = anterior.find((i) => i.id === item.id)
      const novosItens = existente
        ? anterior.map((i) => i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i)
        : [...anterior, { id: item.id, nome: item.nome, preco: item.preco, imagem_url: item.imagem_url, quantidade: 1 }]
      localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(novosItens))
      return novosItens
    })
  }, [])

  const removerDoCarrinho = useCallback((id: string) => {
    setItens((anterior) => {
      const novosItens = anterior.filter((i) => i.id !== id)
      localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(novosItens))
      return novosItens
    })
  }, [])

  const alterarQuantidade = useCallback((id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(id)
      return
    }
    setItens((anterior) => {
      const novosItens = anterior.map((i) => i.id === id ? { ...i, quantidade } : i)
      localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(novosItens))
      return novosItens
    })
  }, [removerDoCarrinho])

  const limparCarrinho = useCallback(() => {
    salvarItens([])
  }, [salvarItens])

  const totalItens = itens.reduce((soma, item) => soma + item.quantidade, 0)
  const totalPreco = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0)

  return {
    itens,
    adicionarAoCarrinho,
    removerDoCarrinho,
    alterarQuantidade,
    limparCarrinho,
    totalItens,
    totalPreco,
  }
}
