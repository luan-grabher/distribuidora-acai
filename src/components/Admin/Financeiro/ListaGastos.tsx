'use client'

import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import RepeatIcon from '@mui/icons-material/Repeat'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import EventIcon from '@mui/icons-material/Event'
import FormularioGasto from './FormularioGasto'
import CabecalhoPagina from '../CabecalhoPagina'
import CartaoMetricaDashboard from '../Dashboard/CartaoMetricaDashboard'
import { useGastosAdmin } from '@/hooks/useGastosAdmin'
import { gastoEstaAtivoNoMes } from '@/lib/gastos/calcularGastosDoMes'
import type { Gasto, NovoGasto, EdicaoGasto, TipoGasto } from '@/types/gasto'

function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function calcularParcelaAtual(dataInicio: string, targetYear: number, targetMonthZeroBased: number): number {
  const inicio = new Date(dataInicio)
  const mesesDecorridos = (targetYear - inicio.getFullYear()) * 12 + (targetMonthZeroBased - inicio.getMonth())
  return Math.max(1, mesesDecorridos + 1)
}

const corPorTipo: Record<TipoGasto, 'default' | 'primary' | 'warning'> = {
  unico: 'default',
  recorrente: 'primary',
  parcelado: 'warning',
}

const labelPorTipo: Record<TipoGasto, string> = {
  unico: 'Único',
  recorrente: 'Recorrente',
  parcelado: 'Parcelado',
}

const filtrosTipo: { valor: TipoGasto | 'todos'; label: string }[] = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'recorrente', label: 'Recorrentes' },
  { valor: 'parcelado', label: 'Parcelados' },
  { valor: 'unico', label: 'Únicos' },
]

export default function ListaGastos() {
  const { gastos, carregando, erro, criarGasto, atualizarGasto, excluirGasto } = useGastosAdmin()
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [gastoEdicao, setGastoEdicao] = useState<Gasto | null>(null)
  const [idParaExcluir, setIdParaExcluir] = useState<string | null>(null)
  const [filtroAtivo, setFiltroAtivo] = useState<TipoGasto | 'todos'>('todos')
  const [mesSelecionado, setMesSelecionado] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const abrirNovoGasto = () => {
    setGastoEdicao(null)
    setFormularioAberto(true)
  }

  const abrirEdicao = (gasto: Gasto) => {
    setGastoEdicao(gasto)
    setFormularioAberto(true)
  }

  const handleSalvar = async (dados: NovoGasto | EdicaoGasto) => {
    if (gastoEdicao) {
      await atualizarGasto(gastoEdicao.id, dados as EdicaoGasto)
    } else {
      await criarGasto(dados as NovoGasto)
    }
  }

  const handleExcluir = async () => {
    if (!idParaExcluir) return
    await excluirGasto(idParaExcluir)
    setIdParaExcluir(null)
  }

  const totalRecorrenteMensal = useMemo(() => {
    const [y, m] = mesSelecionado.split('-').map(Number)
    const mz = m - 1
    return gastos.filter((g) => g.tipo === 'recorrente' && gastoEstaAtivoNoMes(g, y, mz)).reduce((soma, g) => soma + g.valor, 0)
  }, [gastos, mesSelecionado])

  const totalParceladoMensal = useMemo(() => {
    const [y, m] = mesSelecionado.split('-').map(Number)
    const mz = m - 1
    return gastos.filter((g) => g.tipo === 'parcelado' && gastoEstaAtivoNoMes(g, y, mz)).reduce((soma, g) => soma + g.valor, 0)
  }, [gastos, mesSelecionado])

  const totalUnicoMensal = useMemo(() => {
    const [y, m] = mesSelecionado.split('-').map(Number)
    const mz = m - 1
    return gastos.filter((g) => g.tipo === 'unico' && gastoEstaAtivoNoMes(g, y, mz)).reduce((soma, g) => soma + g.valor, 0)
  }, [gastos, mesSelecionado])

  const totalMesAtual = totalRecorrenteMensal + totalParceladoMensal + totalUnicoMensal

  const gastosFiltrados = useMemo(
    () => filtroAtivo === 'todos' ? gastos : gastos.filter((g) => g.tipo === filtroAtivo),
    [gastos, filtroAtivo]
  )

  if (carregando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#4A0080' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <CabecalhoPagina
        titulo="Financeiro"
        labelBotao="Novo Gasto"
        onClicarBotao={abrirNovoGasto}
      />

      {erro && <Alert severity="error">{erro}</Alert>}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Total do Mês"
            valor={formatarReais(totalMesAtual)}
            subtitulo="Todos os gastos ativos"
            corDestaque="#4A0080"
            Icone={AttachMoneyIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Recorrentes"
            valor={formatarReais(totalRecorrenteMensal)}
            subtitulo="Gastos mensais fixos"
            corDestaque="#2E7D32"
            Icone={RepeatIcon}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Parcelados"
            valor={formatarReais(totalParceladoMensal)}
            subtitulo="Parcelas ativas este mês"
            corDestaque="#F9A800"
            Icone={CreditCardIcon}
            corIcone="#C47A00"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CartaoMetricaDashboard
            titulo="Únicos"
            valor={formatarReais(totalUnicoMensal)}
            subtitulo="Pagamentos únicos este mês"
            corDestaque="#1565C0"
            Icone={EventIcon}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {filtrosTipo.map((filtro) => (
          <Button
            key={filtro.valor}
            variant={filtroAtivo === filtro.valor ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setFiltroAtivo(filtro.valor)}
            sx={{ borderRadius: '50px', textTransform: 'none' }}
          >
            {filtro.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Mês"
          type="month"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
          size="small"
          sx={{ width: 180 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'background.paper' } }}>
              <TableCell>Descrição</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Parcelas</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gastosFiltrados.map((gasto) => {
              const [y, m] = mesSelecionado.split('-').map(Number)
              const mz = m - 1
              const parcelaAtual = gasto.tipo === 'parcelado' ? calcularParcelaAtual(gasto.data_inicio, y, mz) : null
              const ativoNestesMes = gastoEstaAtivoNoMes(gasto, y, mz)
              return (
                <TableRow key={gasto.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight={600}>{gasto.descricao}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{gasto.categoria ?? '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={labelPorTipo[gasto.tipo]}
                      color={corPorTipo[gasto.tipo]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} color="error.main">
                      {formatarReais(gasto.valor)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(gasto.data_inicio).toLocaleDateString('pt-BR')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {gasto.tipo === 'parcelado' && gasto.total_parcelas ? (
                      <Typography variant="body2" fontWeight={600}>
                        {Math.min(parcelaAtual ?? 1, gasto.total_parcelas)}/{gasto.total_parcelas}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        ativoNestesMes
                          ? (gasto.status === 'pago' ? 'Pago este mês' : 'Pendente este mês')
                          : (gasto.status === 'pago' ? 'Pago' : 'Pendente')
                      }
                      color={ativoNestesMes ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => abrirEdicao(gasto)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setIdParaExcluir(gasto.id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
            {gastosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">Nenhum gasto cadastrado</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <FormularioGasto
        aberto={formularioAberto}
        onFechar={() => setFormularioAberto(false)}
        gastoEdicao={gastoEdicao}
        onSalvar={handleSalvar}
      />

      <Dialog open={idParaExcluir !== null} onClose={() => setIdParaExcluir(null)} PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={700}>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este gasto? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIdParaExcluir(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleExcluir} sx={{ borderRadius: '50px' }}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
