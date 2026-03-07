import DashboardLayout from '@/components/Admin/DashboardLayout'
import ListaPedidos from '@/components/Admin/Pedidos/ListaPedidos'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pedidos | Admin',
}

export default function PaginaPedidos() {
  return (
    <DashboardLayout>
      <ListaPedidos />
    </DashboardLayout>
  )
}
