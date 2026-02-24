import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth/login'

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json()
    const sessao = await login(email, senha)

    const resposta = NextResponse.json({ sucesso: true })

    if (!sessao?.access_token) {
      return NextResponse.json({ erro: 'Sessão inválida' }, { status: 401 })
    }

    resposta.cookies.set('admin_token', sessao.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return resposta
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : 'Erro ao fazer login'
    return NextResponse.json({ erro: mensagem }, { status: 401 })
  }
}
