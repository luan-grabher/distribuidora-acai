'use client'

import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import type { ItemCarrinho } from '@/types/carrinho'

type PropsCarrinhoDrawer = {
  aberto: boolean
  onFechar: () => void
  itens: ItemCarrinho[]
  totalPreco: number
  onAlterarQuantidade: (id: string, quantidade: number) => void
  onRemover: (id: string) => void
  onFinalizar: () => void
}

export default function CarrinhoDrawer({
  aberto,
  onFechar,
  itens,
  totalPreco,
  onAlterarQuantidade,
  onRemover,
  onFinalizar,
}: PropsCarrinhoDrawer) {
  return (
    <Drawer
      anchor="right"
      open={aberto}
      onClose={onFechar}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700}>
          Seu Pedido
        </Typography>
        <IconButton onClick={onFechar}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {itens.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary">
              Seu carrinho está vazio
            </Typography>
          </Box>
        )}
        <Stack spacing={2}>
          {itens.map((item) => (
            <Box key={item.id}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight={600}>
                    {item.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    R$ {item.preco.toFixed(2).replace('.', ',')} cada
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="primary" sx={{ mt: 0.5 }}>
                    R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <IconButton size="small" onClick={() => onAlterarQuantidade(item.id, item.quantidade - 1)}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body1" fontWeight={600} sx={{ minWidth: 24, textAlign: 'center' }}>
                    {item.quantidade}
                  </Typography>
                  <IconButton size="small" onClick={() => onAlterarQuantidade(item.id, item.quantidade + 1)}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onRemover(item.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Stack>
      </Box>

      {itens.length > 0 && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Total
            </Typography>
            <Typography variant="h6" fontWeight={800} color="primary">
              R$ {totalPreco.toFixed(2).replace('.', ',')}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="success"
            size="large"
            startIcon={<WhatsAppIcon />}
            onClick={onFinalizar}
            sx={{
              borderRadius: '50px',
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              background: '#25D366',
              '&:hover': { background: '#1ebe5d' },
            }}
          >
            Finalizar no WhatsApp
          </Button>
        </Box>
      )}
    </Drawer>
  )
}
