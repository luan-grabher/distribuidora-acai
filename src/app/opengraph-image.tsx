import { ImageResponse } from 'next/og'
import { siteConfig } from '@/config/siteConfig'

export const runtime = 'edge'
export const alt = `${siteConfig.company.name} — Açaí Premium para Açaiterias`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function ogImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #4A0080 0%, #7b2d8b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 68, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>
          🫐 {siteConfig.company.name}
        </div>
        <div style={{ fontSize: 34, marginTop: 28, opacity: 0.9, textAlign: 'center' }}>
          Açaí Premium para Açaiterias — Porto Alegre
        </div>
        <div style={{ fontSize: 24, marginTop: 20, opacity: 0.75, textAlign: 'center' }}>
          Produtor direto · Entrega em 24h · 40+ açaiterias atendidas
        </div>
      </div>
    ),
    size
  )
}
