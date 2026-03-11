import { getClienteSupabaseAdmin } from '../clienteSupabase'

export async function removerItemSupabase(id: string): Promise<void> {
  const { error } = await getClienteSupabaseAdmin()
    .from('itens_catalogo')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
