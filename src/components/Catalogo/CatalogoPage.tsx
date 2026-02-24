'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab'
import Badge from '@mui/material/Badge'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ItemCatalogo from './ItemCatalogo'
import CarrinhoDrawer from './CarrinhoDrawer'
import { useCarrinho } from '@/hooks/useCarrinho'
import { gerarMensagemPedido, gerarUrlWhatsapp } from '@/lib/whatsapp/gerarPedido'
import { siteConfig } from '@/config/siteConfig'
import type { Item } from '@/types/item'

type PropsCatalogoPage = {
  itens: Item[]
}

export default function CatalogoPage({ itens }: PropsCatalogoPage) {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const { itens: itensCarrinho, adicionarAoCarrinho, removerDoCarrinho, alterarQuantidade, totalItens, totalPreco } = useCarrinho()

  const finalizarPedido = () => {
    const mensagem = gerarMensagemPedido(itensCarrinho)
    const url = gerarUrlWhatsapp(siteConfig.company.whatsapp, mensagem)
    window.open(url, '_blank')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4A0080 0%, #7B1FA2 100%)',
          py: { xs: 8, md: 10 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          fontWeight={800}
          color="white"
          sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 1 }}
        >
          Cardápio
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>
          Escolha os produtos para o seu pedido
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 } }}>
        {itens.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum produto disponível no momento.
            </Typography>
          </Box>
        )}
        <Grid container spacing={3}>
          {itens.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ItemCatalogo item={item} onAdicionar={adicionarAoCarrinho} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Fab
        color="primary"
        onClick={() => setCarrinhoAberto(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          boxShadow: '0 8px 24px rgba(74,0,128,0.4)',
        }}
      >
        <Badge badgeContent={totalItens} color="error" max={99}>
          <ShoppingCartIcon />
        </Badge>
      </Fab>

      <CarrinhoDrawer
        aberto={carrinhoAberto}
        onFechar={() => setCarrinhoAberto(false)}
        itens={itensCarrinho}
        totalPreco={totalPreco}
        onAlterarQuantidade={alterarQuantidade}
        onRemover={removerDoCarrinho}
        onFinalizar={finalizarPedido}
      />
    </Box>
  )
}
