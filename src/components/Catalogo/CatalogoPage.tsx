'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab'
import Button from '@mui/material/Button'
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 10, md: 0 } }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4A0080 0%, #7B1FA2 100%)',
          pt: { xs: 15, md: 20 },
          pb: { xs: 8, md: 10 },
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
          Catálogo
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>
          Escolha os produtos para o seu pedido
        </Typography>
        <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 1 }}>
          {siteConfig.company.operatingHours.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
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
              <ItemCatalogo
                item={item}
                onAdicionar={adicionarAoCarrinho}
                onDiminuir={(it) => alterarQuantidade(it.id, (itensCarrinho.find(i => i.id === it.id)?.quantidade ?? 0) - 1)}
                quantidade={itensCarrinho.find(i => i.id === item.id)?.quantidade ?? 0}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 -6px 18px rgba(0,0,0,0.06)',
            zIndex: (theme) => theme.zIndex.drawer - 1,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {itensCarrinho.length} ite{itensCarrinho.length === 1 ? 'm' : 'ns'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                R$ {totalPreco.toFixed(2).replace('.', ',')}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCarrinhoAberto(true)}
            sx={{ borderRadius: '50px', px: 3, py: 1.25, fontWeight: 700 }}
          >
            Finalizar
          </Button>
        </Box>

        <Fab
          color="primary"
          onClick={() => setCarrinhoAberto(true)}
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
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
      </Box>

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
