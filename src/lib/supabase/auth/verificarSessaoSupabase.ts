import { clienteSupabaseAdmin } from '../clienteSupabase'

export async function verificarSessaoSupabase(token: string) {
  const { data, error } = await clienteSupabaseAdmin.auth.getUser(token)
  if (error) return null
  return data.user
}
