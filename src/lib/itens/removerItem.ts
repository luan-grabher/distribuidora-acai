import { removerItemSupabase } from '@/lib/supabase/itens/removerItemSupabase'

export async function removerItem(id: string): Promise<void> {
  return removerItemSupabase(id)
}
