'use client'

import { useState, useMemo } from 'react'
import type { Pedido, StatusPedido, FormaPagamento } from '@/types/pedido'

export type FiltrosPedidos = {
  dataInicio: string
  dataFim: string
  nomeCliente: string
  formaPagamento: FormaPagamento | ''
  status: StatusPedido | ''
}

const filtrosVazios: FiltrosPedidos = {
  dataInicio: '',
  dataFim: '',
  nomeCliente: '',
  formaPagamento: '',
  status: '',
}

export function useFiltrosPedidos(pedidos: Pedido[]) {
  const [filtros, setFiltros] = useState<FiltrosPedidos>(filtrosVazios)

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((pedido) => {
      if (filtros.dataInicio) {
        const [anoInicio, mesInicio, diaInicio] = filtros.dataInicio.split('-').map(Number)
        const dataInicio = new Date(anoInicio, mesInicio - 1, diaInicio, 0, 0, 0, 0)
        const dataPedido = new Date(pedido.criado_em)
        if (dataPedido < dataInicio) return false
      }

      if (filtros.dataFim) {
        const [anoFim, mesFim, diaFim] = filtros.dataFim.split('-').map(Number)
        const dataFim = new Date(anoFim, mesFim - 1, diaFim, 23, 59, 59, 999)
        const dataPedido = new Date(pedido.criado_em)
        if (dataPedido > dataFim) return false
      }

      if (filtros.nomeCliente.trim()) {
        const nomeNormalizado = pedido.nome_cliente.toLowerCase()
        const filtroNormalizado = filtros.nomeCliente.trim().toLowerCase()
        if (!nomeNormalizado.includes(filtroNormalizado)) return false
      }

      if (filtros.formaPagamento) {
        if (pedido.forma_pagamento !== filtros.formaPagamento) return false
      }

      if (filtros.status) {
        if (pedido.status !== filtros.status) return false
      }

      return true
    })
  }, [pedidos, filtros])

  const alterarFiltro = <K extends keyof FiltrosPedidos>(campo: K, valor: FiltrosPedidos[K]) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  const limparFiltros = () => setFiltros(filtrosVazios)

  const possuiFiltrosAtivos = Object.values(filtros).some((valor) => valor !== '')

  return { filtros, pedidosFiltrados, alterarFiltro, limparFiltros, possuiFiltrosAtivos }
}
