import DashboardLayout from '@/components/Admin/DashboardLayout'
import ListaGastos from '@/components/Admin/Financeiro/ListaGastos'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financeiro | Admin',
}

export default function PaginaFinanceiro() {
  return (
    <DashboardLayout>
      <ListaGastos />
    </DashboardLayout>
  )
}
