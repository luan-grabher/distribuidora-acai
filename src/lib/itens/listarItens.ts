import { listarItensSupabase, listarTodosItensSupabase } from '@/lib/supabase/itens/listarItensSupabase'
import type { Item } from '@/types/item'

export async function listarItens(): Promise<Item[]> {
  return listarItensSupabase()
}

export async function listarTodosItens(): Promise<Item[]> {
  return listarTodosItensSupabase()
}
