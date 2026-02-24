import LoginForm from '@/components/Admin/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login',
}

export default function PaginaLogin() {
  return <LoginForm />
}
