import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { Item, EdicaoItem } from '@/types/item'
import { normalizarCamposNumericosDoItem } from './normalizarItem'

export async function editarItemSupabase(id: string, dados: EdicaoItem): Promise<Item> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('itens_catalogo')
    .update(dados)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return normalizarCamposNumericosDoItem(data as Item)
}
