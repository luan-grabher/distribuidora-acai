import { getClienteSupabaseAdmin } from '../clienteSupabase'

export async function verificarSessaoSupabase(token: string) {
  const { data, error } = await getClienteSupabaseAdmin().auth.getUser(token)
  if (error) return null
  return data.user
}
