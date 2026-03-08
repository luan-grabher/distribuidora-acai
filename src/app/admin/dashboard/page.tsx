import DashboardLayout from '@/components/Admin/DashboardLayout'
import InicioDashboard from '@/components/Admin/Dashboard/InicioDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Início — Admin',
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <InicioDashboard />
    </DashboardLayout>
  )
}
