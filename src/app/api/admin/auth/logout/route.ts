import { NextResponse } from 'next/server'

export async function POST() {
  const resposta = NextResponse.json({ sucesso: true })
  resposta.cookies.delete('admin_token')
  return resposta
}
