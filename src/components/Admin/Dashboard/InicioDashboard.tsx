'use client'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SavingsIcon from '@mui/icons-material/Savings'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useDashboardAdmin } from '@/hooks/useDashboardAdmin'
import CartaoMetricaDashboard from './CartaoMetricaDashboard'
import CartaoVendasPorFormaPagamento from './CartaoVendasPorFormaPagamento'
import GraficoFaturamentoDiario from './GraficoFaturamentoDiario'
import GraficoItensMaisVendidos from './GraficoItensMaisVendidos'
import ProjecaoItensMes from './ProjecaoItensMes'

function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function obterNomeMes(mes: number, ano: number): string {
  return new Date(ano, mes - 1, 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
}

export default function InicioDashboard() {
  const { dados, carregando, erro, mes, ano, eMesAtual, irParaMesAnterior, irParaProximoMes } = useDashboardAdmin()

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

  const nomeMes = obterNomeMes(mes, ano)
  const nomeMesCapitalizado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)

  return (
    <Box>
      <Box sx={{ mb: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Dashboard
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Tooltip title="Mês anterior">
            <IconButton size="small" onClick={irParaMesAnterior} sx={{ color: 'text.secondary' }}>
              <ChevronLeftIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ minWidth: 180, textAlign: 'center' }}>
            {nomeMesCapitalizado}
          </Typography>
          <Tooltip title={eMesAtual ? 'Você já está no mês atual' : 'Próximo mês'}>
            <span>
              <IconButton size="small" onClick={irParaProximoMes} disabled={eMesAtual} sx={{ color: 'text.secondary' }}>
                <ChevronRightIcon />
              </IconButton>
            </span>
          </Tooltip>
          {eMesAtual && (
            <Chip label="Mês atual" size="small" color="primary" sx={{ ml: 1 }} />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Dia {dados.diasDecorridos} de {dados.diasNoMes} &nbsp;·&nbsp; {dados.diasRestantes} dias restantes
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
            titulo="Média de Faturamento por Dia"
            valor={formatarReais(dados.mediaFaturamentoPorDia)}
            subtitulo="Faturamento médio diário"
            corDestaque="#2E7D32"
            Icone={QueryStatsIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Projeção de Faturamento"
            valor={formatarReais(dados.projecaoFaturamentoMes)}
            subtitulo={dados.diasRestantes > 0 ? `+${formatarReais(dados.mediaFaturamentoPorDia * dados.diasRestantes)} nos próximos ${dados.diasRestantes} dias` : 'Mês encerrado'}
            corDestaque="#F9A800"
            Icone={TrendingUpIcon}
            corIcone="#C47A00"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Lucro Atual"
            valor={formatarReais(dados.lucroAtual)}
            subtitulo="Faturamento menos custo dos itens"
            corDestaque="#00695C"
            Icone={SavingsIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Média de Lucro por Dia"
            valor={formatarReais(dados.mediaDeLucroPorDia)}
            subtitulo="Lucro médio diário"
            corDestaque="#1565C0"
            Icone={QueryStatsIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Total de Gastos no Mês"
            valor={formatarReais(dados.totalGastosNoMes)}
            subtitulo="Soma de todos os gastos ativos"
            corDestaque="#B71C1C"
            Icone={ShoppingCartIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Projeção de Lucro Líquido"
            valor={formatarReais(dados.projecaoLucroMes)}
            subtitulo="Lucro projetado descontando os gastos"
            corDestaque="#4527A0"
            Icone={AccountBalanceIcon}
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
