import { getClienteSupabaseAdmin } from '../clienteSupabase'

export async function removerGastoSupabase(id: string): Promise<void> {
  const { error } = await getClienteSupabaseAdmin()
    .from('gastos')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
