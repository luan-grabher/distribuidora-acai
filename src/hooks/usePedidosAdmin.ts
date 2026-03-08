'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Pedido, EdicaoPedido, NovoPedido } from '@/types/pedido'

export function usePedidosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const router = useRouter()

  const redirecionarParaLoginSeNaoAutorizado = useCallback((status: number) => {
    if (status === 401) router.push('/admin/login')
  }, [router])

  const buscarPedidos = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await fetch('/api/admin/pedidos')
      if (!resposta.ok) {
        redirecionarParaLoginSeNaoAutorizado(resposta.status)
        throw new Error('Erro ao buscar pedidos')
      }
      const dados = await resposta.json()
      setPedidos(dados)
    } catch {
      setErro('Erro ao carregar pedidos')
    } finally {
      setCarregando(false)
    }
  }, [redirecionarParaLoginSeNaoAutorizado])

  useEffect(() => {
    buscarPedidos()
  }, [buscarPedidos])

  const criarPedido = useCallback(async (dados: NovoPedido) => {
    const resposta = await fetch('/api/admin/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
    redirecionarParaLoginSeNaoAutorizado(resposta.status)
    if (!resposta.ok) throw new Error('Erro ao criar pedido')
    await buscarPedidos()
  }, [buscarPedidos, redirecionarParaLoginSeNaoAutorizado])

  const atualizarPedido = useCallback(async (id: string, dados: EdicaoPedido) => {
    const resposta = await fetch(`/api/admin/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
    redirecionarParaLoginSeNaoAutorizado(resposta.status)
    if (!resposta.ok) throw new Error('Erro ao atualizar pedido')
    await buscarPedidos()
  }, [buscarPedidos, redirecionarParaLoginSeNaoAutorizado])

  return { pedidos, carregando, erro, criarPedido, atualizarPedido }
}
