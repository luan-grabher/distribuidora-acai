import { clienteSupabaseAdmin } from '../clienteSupabase'

export async function removerItemSupabase(id: string): Promise<void> {
  const { error } = await clienteSupabaseAdmin
    .from('itens_catalogo')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
