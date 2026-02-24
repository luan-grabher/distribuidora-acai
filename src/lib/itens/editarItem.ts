import { editarItemSupabase } from '@/lib/supabase/itens/editarItemSupabase'
import type { Item, EdicaoItem } from '@/types/item'

export async function editarItem(id: string, dados: EdicaoItem): Promise<Item> {
  return editarItemSupabase(id, dados)
}
