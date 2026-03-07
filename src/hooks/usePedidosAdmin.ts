'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Pedido, EdicaoPedido } from '@/types/pedido'

export function usePedidosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const buscarPedidos = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await fetch('/api/admin/pedidos')
      if (!resposta.ok) throw new Error('Erro ao buscar pedidos')
      const dados = await resposta.json()
      setPedidos(dados)
    } catch {
      setErro('Erro ao carregar pedidos')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    buscarPedidos()
  }, [buscarPedidos])

  const atualizarPedido = useCallback(async (id: string, dados: EdicaoPedido) => {
    const resposta = await fetch(`/api/admin/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
    if (!resposta.ok) throw new Error('Erro ao atualizar pedido')
    await buscarPedidos()
  }, [buscarPedidos])

  return { pedidos, carregando, erro, atualizarPedido }
}
