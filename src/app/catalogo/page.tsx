import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import CatalogoPage from '@/components/Catalogo/CatalogoPage'
import { listarItens } from '@/lib/itens/listarItens'
import type { Metadata } from 'next'
import { siteConfig } from '@/config/siteConfig'
import { Box } from '@mui/material'

export const metadata: Metadata = {
  title: `Catálogo | ${siteConfig.company.name}`,
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
      <Box
        id={"espaco-para-exibir-footer-em-cima-do-carrinho-no-mobile"}
        sx={{
          height: '80px',
          display: { xs: 'block', md: 'none' },
        }}
      >        
      </Box>
    </>
  )
}
