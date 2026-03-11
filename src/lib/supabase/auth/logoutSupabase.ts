import { getClienteSupabase } from '../clienteSupabase'

export async function logoutSupabase(): Promise<void> {
  const { error } = await getClienteSupabase().auth.signOut()
  if (error) throw new Error(error.message)
}
