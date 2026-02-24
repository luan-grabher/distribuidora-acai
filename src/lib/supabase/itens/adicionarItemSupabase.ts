import { clienteSupabaseAdmin } from '../clienteSupabase'
import type { Item, NovoItem } from '@/types/item'

export async function adicionarItemSupabase(item: NovoItem): Promise<Item> {
  const { data, error } = await clienteSupabaseAdmin
    .from('itens_catalogo')
    .insert(item)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Item
}
