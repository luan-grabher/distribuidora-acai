import { getClienteSupabaseAdmin } from '../clienteSupabase'

export async function uploadImagemParaStorage(arquivo: File): Promise<string> {
  const caminho = `itens/${crypto.randomUUID()}.jpg`
  const supabase = getClienteSupabaseAdmin()

  const { error } = await supabase.storage
    .from('imagens-catalogo')
    .upload(caminho, arquivo, { contentType: 'image/jpeg', upsert: false })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('imagens-catalogo')
    .getPublicUrl(caminho)

  return data.publicUrl
}
