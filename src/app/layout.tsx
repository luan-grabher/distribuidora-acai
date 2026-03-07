import type { Metadata } from 'next'
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'
import SeoJsonLd from '@/components/SeoJsonLd/SeoJsonLd'
import { siteConfig } from '@/config/siteConfig'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.company.name} | Açaí Premium para Açaiterias — Porto Alegre`,
    template: `%s | ${siteConfig.company.name}`,
  },
  description: siteConfig.company.description,
  keywords: siteConfig.company.keywords,
  authors: [{ name: siteConfig.company.name }],
  creator: siteConfig.company.name,
  icons: {
    icon: siteConfig.logo.url,
    shortcut: siteConfig.logo.url,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteConfig.url,
    siteName: siteConfig.company.name,
    title: `${siteConfig.company.name} | Açaí Premium para Açaiterias`,
    description: siteConfig.company.shortDescription,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${siteConfig.company.name} — Açaí Premium para Açaiterias`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.company.name} | Açaí Premium`,
    description: siteConfig.company.shortDescription,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SeoJsonLd />
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
}
