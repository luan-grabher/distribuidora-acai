import { clienteSupabase } from '../clienteSupabase'

export async function logoutSupabase(): Promise<void> {
  const { error } = await clienteSupabase.auth.signOut()
  if (error) throw new Error(error.message)
}
