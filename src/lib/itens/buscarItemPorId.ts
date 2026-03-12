import { buscarItemPorIdSupabase } from '@/lib/supabase/itens/listarItensSupabase'
import type { Item } from '@/types/item'

export async function buscarItemPorId(id: string): Promise<Item | null> {
  return buscarItemPorIdSupabase(id)
}
