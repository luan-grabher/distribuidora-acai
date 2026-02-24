import { clienteSupabase } from '../clienteSupabase'
import type { Item } from '@/types/item'

export async function listarItensSupabase(): Promise<Item[]> {
  const { data, error } = await clienteSupabase
    .from('itens_catalogo')
    .select('*')
    .eq('ativo', true)
    .order('criado_em', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Item[]
}

export async function listarTodosItensSupabase(): Promise<Item[]> {
  const { data, error } = await clienteSupabase
    .from('itens_catalogo')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Item[]
}
