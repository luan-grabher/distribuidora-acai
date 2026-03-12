import { NextRequest, NextResponse } from 'next/server'
import { verificarSessao } from '@/lib/auth/verificarSessao'
import { uploadImagemParaStorage } from '@/lib/supabase/storage/uploadImagemParaStorage'

async function autenticarAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return null
  return verificarSessao(token)
}

export async function POST(request: NextRequest) {
  const usuario = await autenticarAdmin(request)
  if (!usuario) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const formData = await request.formData()
    const arquivo = formData.get('arquivo') as File
    if (!arquivo) return NextResponse.json({ erro: 'Arquivo não enviado' }, { status: 400 })

    const url = await uploadImagemParaStorage(arquivo)
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ erro: 'Erro ao fazer upload da imagem' }, { status: 500 })
  }
}
