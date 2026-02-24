import { clienteSupabase } from '../clienteSupabase'

export async function loginSupabase(email: string, senha: string) {
  const { data, error } = await clienteSupabase.auth.signInWithPassword({
    email,
    password: senha,
  })

  if (error) throw new Error(error.message)
  return data.session
}
