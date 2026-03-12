import { getClienteSupabaseAdmin } from '../clienteSupabase'

const PREFIXO_BUCKET_NO_PATH = '/storage/v1/object/public/imagens-catalogo/'

export async function excluirImagemDoStorage(urlPublica: string): Promise<void> {
  if (!urlPublica.includes(PREFIXO_BUCKET_NO_PATH)) return

  const caminho = urlPublica.split(PREFIXO_BUCKET_NO_PATH)[1]
  if (!caminho) return

  await getClienteSupabaseAdmin().storage
    .from('imagens-catalogo')
    .remove([caminho])
}
