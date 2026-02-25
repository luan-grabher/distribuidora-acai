'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import type { Item } from '@/types/item'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import RemoveIcon from '@mui/icons-material/Remove'

type PropsItemCatalogo = {
  item: Item
  onAdicionar: (item: Item) => void
  onDiminuir?: (item: Item) => void
  quantidade?: number
}

export default function ItemCatalogo({ item, onAdicionar, onDiminuir, quantidade = 0 }: PropsItemCatalogo) {
  const semEstoque = item.estoque <= 0

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(74,0,128,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 32px rgba(74,0,128,0.2)',
        },
        opacity: semEstoque ? 0.6 : 1,
      }}
    >
      {item.imagem_url && (
        <CardMedia
          component="img"
          height="200"
          image={item.imagem_url}
          alt={item.nome}
          sx={{ objectFit: 'cover' }}
        />
      )}
      {!item.imagem_url && (
        <Box
          sx={{
            height: 200,
            background: 'linear-gradient(135deg, #4A0080 0%, #7B1FA2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
          }}
        >
          🫐
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.2 }}>
            {item.nome}
          </Typography>
          {semEstoque && (
            <Chip label="Indisponível" size="small" color="default" />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
          {item.descricao}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={800} color="primary">
            R$ {item.preco.toFixed(2).replace('.', ',')}
          </Typography>
          {quantidade > 0 && (
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" display={'flex'} alignItems="center" gap={0.5} lineHeight={1}>
                <b>{quantidade}x</b>
                <ShoppingCartIcon fontSize="small" />
                {onDiminuir && (
                  <IconButton size="small" color="error" onClick={() => onDiminuir(item)} sx={{ ml: 0.5 }}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                )}
              </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => onAdicionar(item)}
          disabled={semEstoque}
          sx={{ borderRadius: '50px', py: 1.5 }}
        >
          {semEstoque ? 'Indisponível' : 'Adicionar'}
        </Button>
      </CardActions>
    </Card>
  )
}
