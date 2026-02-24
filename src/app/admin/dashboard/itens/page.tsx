import DashboardLayout from '@/components/Admin/DashboardLayout'
import ListaItens from '@/components/Admin/Itens/ListaItens'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Itens do Catálogo | Admin',
}

export default function PaginaItens() {
  return (
    <DashboardLayout>
      <ListaItens />
    </DashboardLayout>
  )
}
