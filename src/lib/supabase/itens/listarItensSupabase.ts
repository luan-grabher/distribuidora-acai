import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { Item } from '@/types/item'

export async function buscarItemPorIdSupabase(id: string): Promise<Item | null> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('itens_catalogo')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Item
}

export async function listarItensSupabase(): Promise<Item[]> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('itens_catalogo')
    .select('*')
    .eq('ativo', true)
    .order('nome', { ascending: true })

  if (error) throw new Error(error.message)
  return data as Item[]
}

export async function listarTodosItensSupabase(): Promise<Item[]> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('itens_catalogo')
    .select('*')
    .order('nome', { ascending: true })

  if (error) throw new Error(error.message)
  return data as Item[]
}
