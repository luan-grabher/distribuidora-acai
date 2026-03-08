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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pt: 2 }}>
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
