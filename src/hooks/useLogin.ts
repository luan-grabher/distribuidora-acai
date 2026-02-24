'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useLogin() {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const router = useRouter()

  const fazerLogin = useCallback(async (email: string, senha: string) => {
    setCarregando(true)
    setErro(null)
    try {
      const resposta = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })

      if (!resposta.ok) {
        const dados = await resposta.json()
        setErro(dados.erro ?? 'Erro ao fazer login')
        return
      }

      router.push('/admin/dashboard/itens')
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }, [router])

  const fazerLogout = useCallback(async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
    } finally {
      router.push('/admin/login')
    }
  }, [router])

  return { fazerLogin, fazerLogout, carregando, erro }
}
