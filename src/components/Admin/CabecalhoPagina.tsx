'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

type PropsCabecalhoPagina = {
  titulo: string
  labelBotao: string
  onClicarBotao: () => void
}

export default function CabecalhoPagina({ titulo, labelBotao, onClicarBotao }: PropsCabecalhoPagina) {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 1.5, md: 0 }, mb: 3, pt: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        {titulo}
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onClicarBotao}
        sx={{ borderRadius: '50px' }}
      >
        {labelBotao}
      </Button>
    </Box>
  )
}
