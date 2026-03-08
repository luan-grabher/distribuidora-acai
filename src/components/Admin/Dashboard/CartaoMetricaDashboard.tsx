'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { SvgIconComponent } from '@mui/icons-material'

type CartaoMetricaDashboardProps = {
  titulo: string
  valor: string
  subtitulo?: string
  corDestaque: string
  Icone: SvgIconComponent
  corIcone?: string
}

export default function CartaoMetricaDashboard({
  titulo,
  valor,
  subtitulo,
  corDestaque,
  Icone,
  corIcone,
}: CartaoMetricaDashboardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `2px solid ${corDestaque}22`,
        background: `linear-gradient(135deg, #fff 0%, ${corDestaque}08 100%)`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${corDestaque}22` },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ lineHeight: 1.4 }}>
            {titulo}
          </Typography>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: `${corDestaque}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icone sx={{ color: corIcone ?? corDestaque, fontSize: 20 }} />
          </Box>
        </Box>
        <Typography variant="h5" fontWeight={700} sx={{ color: corDestaque, mb: 0.5, lineHeight: 1.2 }}>
          {valor}
        </Typography>
        {subtitulo && (
          <Typography variant="caption" color="text.secondary">
            {subtitulo}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
