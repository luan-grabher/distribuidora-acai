import { unstable_cache, revalidateTag } from 'next/cache'
import { after } from 'next/server'
import { listarItensSupabase } from '@/lib/supabase/itens/listarItensSupabase'

const TAG_CACHE_CATALOGO_ITENS = 'catalogo-itens'
const TRINTA_DIAS_EM_SEGUNDOS = 30 * 24 * 60 * 60

export const listarItensComCache = unstable_cache(
  listarItensSupabase,
  [TAG_CACHE_CATALOGO_ITENS],
  {
    tags: [TAG_CACHE_CATALOGO_ITENS],
    revalidate: TRINTA_DIAS_EM_SEGUNDOS,
  }
)

export function invalidarEAquecerCacheItensEmSegundoPlano(): void {
  revalidateTag(TAG_CACHE_CATALOGO_ITENS)
  after(() => listarItensComCache().catch(() => {}))
}
