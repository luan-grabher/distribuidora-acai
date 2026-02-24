import { adicionarItemSupabase } from '@/lib/supabase/itens/adicionarItemSupabase'
import type { Item, NovoItem } from '@/types/item'

export async function adicionarItem(item: NovoItem): Promise<Item> {
  return adicionarItemSupabase(item)
}
