'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import type { ItemMaisVendido } from '@/types/dashboard'

type GraficoItensMaisVendidosProps = {
  itensMaisVendidos: ItemMaisVendido[]
}

const QUANTIDADE_MAXIMA_ITENS_EXIBIDOS = 8

export default function GraficoItensMaisVendidos({ itensMaisVendidos }: GraficoItensMaisVendidosProps) {
  const itensExibidos = itensMaisVendidos.slice(0, QUANTIDADE_MAXIMA_ITENS_EXIBIDOS)

  return (
    <Card sx={{ borderRadius: 3, border: '2px solid #2E7D3218' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            Itens Mais Vendidos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Por quantidade vendida este mês
          </Typography>
        </Box>

        {itensExibidos.length > 0 ? (
          <BarChart
            yAxis={[
              {
                scaleType: 'band',
                data: itensExibidos.map((item) => item.nome),
                tickLabelStyle: { fontSize: 12 },
              },
            ]}
            series={[
              {
                data: itensExibidos.map((item) => item.quantidade),
                label: 'Unidades vendidas',
                color: '#2E7D32',
              },
            ]}
            layout="horizontal"
            height={Math.max(220, itensExibidos.length * 44 + 60)}
            margin={{
              top: 20,
              right: 40,
              bottom: 40,
              left: itensExibidos.length > 0
                ? Math.max(160, Math.max(...itensExibidos.map((item) => item.nome.length)) * 7 + 20)
                : 160,
            }}
            xAxis={[{ label: 'Unidades' }]}
            sx={{
              '.MuiChartsAxis-tickLabel': { fontSize: '0.75rem' },
            }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 220 }}>
            <Typography color="text.secondary">Nenhum item vendido este mês</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
