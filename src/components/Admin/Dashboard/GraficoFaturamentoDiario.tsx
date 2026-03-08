'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import type { FaturamentoDiario } from '@/types/dashboard'

type GraficoFaturamentoDiarioProps = {
  faturamentoPorDia: FaturamentoDiario[]
}

function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function GraficoFaturamentoDiario({ faturamentoPorDia }: GraficoFaturamentoDiarioProps) {
  const diasComFaturamento = faturamentoPorDia.filter((d) => d.faturamento > 0).length
  const totalFaturado = faturamentoPorDia.reduce((soma, d) => soma + d.faturamento, 0)

  return (
    <Card sx={{ borderRadius: 3, border: '2px solid #4A008018' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Faturamento Diário
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {faturamentoPorDia.length > 0
                ? `Dias 1 a ${faturamentoPorDia.length} deste mês`
                : 'Sem dados este mês'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              {diasComFaturamento} dias com vendas
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {formatarReais(totalFaturado)} no total
            </Typography>
          </Box>
        </Box>

        {faturamentoPorDia.length > 0 ? (
          <BarChart
            xAxis={[
              {
                scaleType: 'band',
                data: faturamentoPorDia.map((d) => `${d.dia}`),
                label: 'Dia do mês',
              },
            ]}
            series={[
              {
                data: faturamentoPorDia.map((d) => d.faturamento),
                label: 'Faturamento',
                color: '#4A0080',
                valueFormatter: (valor) => (valor !== null ? formatarReais(valor) : 'R$ 0,00'),
              },
            ]}
            height={280}
            margin={{ top: 20, right: 20, bottom: 40, left: 80 }}
            yAxis={[{ valueFormatter: (valor: number | null) => formatarReais((valor ?? 0) as number) }]}
            sx={{
              '.MuiChartsAxis-tickLabel': { fontSize: '0.75rem' },
            }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280 }}>
            <Typography color="text.secondary">Nenhum pedido este mês</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
