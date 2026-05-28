import { getClienteSupabaseAdmin } from '../clienteSupabase'
import type { Item } from '@/types/item'
import { normalizarCamposNumericosDoItem } from './normalizarItem'
import { siteConfig } from '@/config/siteConfig'

export async function buscarItemPorIdSupabase(id: string): Promise<Item | null> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('itens_catalogo')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return normalizarCamposNumericosDoItem(data as Item)
}

export async function listarItensSupabase(): Promise<Item[]> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('itens_catalogo')
    .select('*')
    .eq('ativo', true)
    .order('nome', { ascending: true })

  if (error) throw new Error(error.message)
  const itens = (data as Item[]).map(normalizarCamposNumericosDoItem)

  const termos = siteConfig.catalogo?.termosEmDestaque ?? []

  const indisponiveis = itens.filter((i) => i.estoque <= 0)
  const disponiveis = itens.filter((i) => i.estoque > 0)

  const promocoes = disponiveis.filter((i) => i.promocao_ativa != null)

  const restantes = disponiveis.filter((i) => !promocoes.includes(i))

  const destacados: Item[] = []
  const usados = new Set<string>()
  promocoes.forEach((p) => usados.add(p.id))

  for (const termo of termos) {
    const t = termo.toLowerCase()
    for (const item of restantes) {
      if (usados.has(item.id)) continue
      const texto = `${item.nome} ${item.descricao}`.toLowerCase()
      if (texto.includes(t)) {
        destacados.push(item)
        usados.add(item.id)
      }
    }
  }

  const comuns = restantes.filter((i) => !usados.has(i.id))

  return [...promocoes, ...destacados, ...comuns, ...indisponiveis]
}

export async function listarTodosItensSupabase(): Promise<Item[]> {
  const { data, error } = await getClienteSupabaseAdmin()
    .from('itens_catalogo')
    .select('*')
    .order('nome', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as Item[]).map(normalizarCamposNumericosDoItem)
}
