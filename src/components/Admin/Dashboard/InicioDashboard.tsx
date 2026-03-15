'use client'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useDashboardAdmin } from '@/hooks/useDashboardAdmin'
import CartaoMetricaDashboard from './CartaoMetricaDashboard'
import CartaoVendasPorFormaPagamento from './CartaoVendasPorFormaPagamento'
import GraficoFaturamentoDiario from './GraficoFaturamentoDiario'
import GraficoItensMaisVendidos from './GraficoItensMaisVendidos'
import ProjecaoItensMes from './ProjecaoItensMes'

function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function obterNomeMesAtual(): string {
  return new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
}

export default function InicioDashboard() {
  const { dados, carregando, erro } = useDashboardAdmin()

  if (carregando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#4A0080' }} />
      </Box>
    )
  }

  if (erro) {
    return <Alert severity="error">{erro}</Alert>
  }

  if (!dados) return null

  const nomeMes = obterNomeMesAtual()
  const nomeMesCapitalizado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {nomeMesCapitalizado} &nbsp;·&nbsp; Dia {dados.diasDecorridos} de {dados.diasNoMes} &nbsp;·&nbsp; {dados.diasRestantes} dias restantes
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Total Faturado no Mês"
            valor={formatarReais(dados.totalFaturadoNoMes)}
            subtitulo={`${dados.diasDecorridos} dias de operação`}
            corDestaque="#4A0080"
            Icone={AttachMoneyIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Média por Dia"
            valor={formatarReais(dados.mediaFaturamentoPorDia)}
            subtitulo="Faturamento médio diário"
            corDestaque="#2E7D32"
            Icone={QueryStatsIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Projeção do Mês"
            valor={formatarReais(dados.projecaoFaturamentoMes)}
            subtitulo={`+${formatarReais(dados.mediaFaturamentoPorDia * dados.diasRestantes)} nos próximos ${dados.diasRestantes} dias`}
            corDestaque="#F9A800"
            Icone={TrendingUpIcon}
            corIcone="#C47A00"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Dias Restantes"
            valor={`${dados.diasRestantes} dias`}
            subtitulo={`de ${dados.diasNoMes} no mês`}
            corDestaque="#1565C0"
            Icone={CalendarTodayIcon}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CartaoVendasPorFormaPagamento vendasPorFormaPagamento={dados.vendasPorFormaPagamento} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          <GraficoFaturamentoDiario faturamentoPorDia={dados.faturamentoPorDia} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <GraficoItensMaisVendidos itensMaisVendidos={dados.itensMaisVendidos} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <ProjecaoItensMes
            itensMaisVendidos={dados.itensMaisVendidos}
            diasDecorridos={dados.diasDecorridos}
            diasNoMes={dados.diasNoMes}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
