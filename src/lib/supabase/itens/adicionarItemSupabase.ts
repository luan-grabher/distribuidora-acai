import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { Item, NovoItem } from '@/types/item'
import { normalizarCamposNumericosDoItem } from './normalizarItem'

export async function adicionarItemSupabase(item: NovoItem): Promise<Item> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('itens_catalogo')
    .insert(item)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return normalizarCamposNumericosDoItem(data as Item)
}
