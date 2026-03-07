import { clienteSupabaseAdmin } from '../clienteSupabase'
import type { Item } from '@/types/item'

export async function listarItensSupabase(): Promise<Item[]> {
  const { data, error } = await clienteSupabaseAdmin
    .from('itens_catalogo')
    .select('*')
    .eq('ativo', true)
    .order('nome', { ascending: true })

  if (error) throw new Error(error.message)
  return data as Item[]
}

export async function listarTodosItensSupabase(): Promise<Item[]> {
  const { data, error } = await clienteSupabaseAdmin
    .from('itens_catalogo')
    .select('*')
    .order('nome', { ascending: true })

  if (error) throw new Error(error.message)
  return data as Item[]
}
