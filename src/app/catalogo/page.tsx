import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import CatalogoPage from '@/components/Catalogo/CatalogoPage'
import { listarItens } from '@/lib/itens/listarItens'
import type { Metadata } from 'next'
import { siteConfig } from '@/config/siteConfig'

export const metadata: Metadata = {
  title: `Cardápio | ${siteConfig.company.name}`,
  description: 'Faça seu pedido diretamente pelo WhatsApp',
}

export default async function PaginaCatalogo() {
  const itens = await listarItens().catch(() => [])

  return (
    <>
      <Header />
      <main>
        <CatalogoPage itens={itens} />
      </main>
      <Footer />
    </>
  )
}
