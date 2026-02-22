import type { Metadata } from 'next'
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'
import { siteConfig } from '@/config/siteConfig'
import './globals.css'

export const metadata: Metadata = {
  title: siteConfig.company.name,
  description: siteConfig.company.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
}
