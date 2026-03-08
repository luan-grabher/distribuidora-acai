'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import type { ItemMaisVendido } from '@/types/dashboard'

type ProjecaoItensMesProps = {
  itensMaisVendidos: ItemMaisVendido[]
  diasDecorridos: number
  diasNoMes: number
}

const QUANTIDADE_MAXIMA_ITENS_EXIBIDOS = 6

function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ProjecaoItensMes({ itensMaisVendidos, diasDecorridos, diasNoMes }: ProjecaoItensMesProps) {
  const progressoMes = Math.round((diasDecorridos / diasNoMes) * 100)
  const itensExibidos = itensMaisVendidos.slice(0, QUANTIDADE_MAXIMA_ITENS_EXIBIDOS)

  return (
    <Card sx={{ borderRadius: 3, border: '2px solid #F9C71522' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Projeção de Itens
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estimativa até o final do mês
            </Typography>
          </Box>
          <Chip
            icon={<TrendingUpIcon />}
            label={`${progressoMes}% do mês`}
            size="small"
            sx={{ backgroundColor: '#F9C71522', color: '#7A5A00', fontWeight: 600 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Dia {diasDecorridos} de {diasNoMes}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {progressoMes}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressoMes}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#F9C71522',
              '& .MuiLinearProgress-bar': { backgroundColor: '#F9C715', borderRadius: 4 },
            }}
          />
        </Box>

        {itensExibidos.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {itensExibidos.map((item) => {
              const progressoItem = Math.min(
                100,
                item.projecaoQuantidade > 0 ? Math.round((item.quantidade / item.projecaoQuantidade) * 100) : 100
              )
              return (
                <Box key={item.nome}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: '55%' }}>
                      {item.nome}
                    </Typography>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight={700} color="primary.main">
                        {item.quantidade} → {item.projecaoQuantidade} un
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatarReais(item.totalFaturado)} → {formatarReais(item.projecaoTotalFaturado)}
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progressoItem}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#4A008012',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#4A0080', borderRadius: 3 },
                    }}
                  />
                </Box>
              )
            })}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
            <Typography color="text.secondary">Nenhum item vendido este mês</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
