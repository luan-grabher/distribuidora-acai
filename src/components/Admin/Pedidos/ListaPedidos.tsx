'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CabecalhoPagina from '../CabecalhoPagina'
import { usePedidosAdmin } from '@/hooks/usePedidosAdmin'
import { useFiltrosPedidos } from '@/hooks/useFiltrosPedidos'
import type { Pedido, StatusPedido, FormaPagamento, NovoPedido, EdicaoPedido } from '@/types/pedido'
import { todosStatusPedido, todasFormasPagamento } from '@/types/pedido'
import FormularioPedido from './FormularioPedido'
import FiltrosPedidosComponent from './FiltrosPedidos'

const coresPorStatus: Record<StatusPedido, 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error'> = {
  'aguardando confirmação': 'warning',
  'confirmado': 'info',
  'em preparo': 'primary',
  'enviado': 'secondary',
  'entregue': 'success',
  'concluído': 'success',
  'cancelado': 'error',
}

type PropsLinhaExpandivel = {
  pedido: Pedido
  onAtualizar: (id: string, dados: EdicaoPedido) => Promise<void>
  onRemover: (id: string) => Promise<void>
  onEditar: (pedido: Pedido) => void
}

function LinhaExpandivel({ pedido, onAtualizar, onRemover, onEditar }: PropsLinhaExpandivel) {
  const [expandido, setExpandido] = useState(false)
  const [atualizando, setAtualizando] = useState(false)
  const [confirmacaoExclusaoAberta, setConfirmacaoExclusaoAberta] = useState(false)

  const handleStatus = async (novoStatus: StatusPedido) => {
    setAtualizando(true)
    try {
      await onAtualizar(pedido.id, { status: novoStatus })
    } finally {
      setAtualizando(false)
    }
  }

  const handleFormaPagamento = async (novaForma: FormaPagamento | '') => {
    setAtualizando(true)
    try {
      await onAtualizar(pedido.id, { forma_pagamento: novaForma === '' ? null : novaForma })
    } finally {
      setAtualizando(false)
    }
  }

  const confirmarExclusao = async () => {
    setAtualizando(true)
    try {
      await onRemover(pedido.id)
    } finally {
      setAtualizando(false)
      setConfirmacaoExclusaoAberta(false)
    }
  }

  const dataFormatada = new Date(pedido.criado_em).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setExpandido(!expandido)}>
            {expandido ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
            {pedido.id.slice(0, 8)}...
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{dataFormatada}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight={600}>{pedido.nome_cliente}</Typography>
          <Typography variant="caption" color="text.secondary">{pedido.telefone_cliente}</Typography>
        </TableCell>
        <TableCell>
          <Typography fontWeight={600} color="primary">
            R$ {pedido.total.toFixed(2).replace('.', ',')}
          </Typography>
        </TableCell>
        <TableCell>
          <FormControl size="small" disabled={atualizando}>
            <Select
              value={pedido.status}
              onChange={(e) => handleStatus(e.target.value as StatusPedido)}
              renderValue={(valor) => (
                <Chip
                  label={valor}
                  color={coresPorStatus[valor as StatusPedido]}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              )}
              sx={{ minWidth: 200 }}
            >
              {todosStatusPedido.map((status) => (
                <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                  <Chip label={status} color={coresPorStatus[status]} size="small" sx={{ textTransform: 'capitalize' }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>
          <FormControl size="small" disabled={atualizando} sx={{ minWidth: 180 }}>
            <Select
              value={pedido.forma_pagamento ?? ''}
              onChange={(e) => handleFormaPagamento(e.target.value as FormaPagamento | '')}
              displayEmpty
              renderValue={(valor) =>
                valor
                  ? <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{valor}</Typography>
                  : <Typography variant="body2" color="text.disabled">Não informado</Typography>
              }
            >
              <MenuItem value="">
                <Typography variant="body2" color="text.secondary">Não informado</Typography>
              </MenuItem>
              {todasFormasPagamento.map((forma) => (
                <MenuItem key={forma} value={forma} sx={{ textTransform: 'capitalize' }}>
                  {forma}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell align="right">
          <IconButton
            size="small"
            disabled={atualizando}
            onClick={() => onEditar(pedido)}
            sx={{ mr: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            disabled={atualizando}
            onClick={() => setConfirmacaoExclusaoAberta(true)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} sx={{ py: 0 }}>
          <Collapse in={expandido} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 3 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Itens do Pedido
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">Preço Unit.</TableCell>
                    <TableCell align="right">Qtd</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedido.itens.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell align="right">R$ {item.preco.toFixed(2).replace('.', ',')}</TableCell>
                      <TableCell align="right">{item.quantidade}</TableCell>
                      <TableCell align="right">R$ {item.subtotal.toFixed(2).replace('.', ',')}</TableCell>
                    </TableRow>
                  ))}
                  {pedido.taxa_entrega > 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ color: 'text.secondary' }}>Tele-entrega</TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary' }}>
                        R$ {pedido.taxa_entrega.toFixed(2).replace('.', ',')}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={3} align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      R$ {pedido.total.toFixed(2).replace('.', ',')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Dialog open={confirmacaoExclusaoAberta} onClose={() => setConfirmacaoExclusaoAberta(false)}>
        <DialogTitle>Excluir pedido</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o pedido de <strong>{pedido.nome_cliente}</strong>? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmacaoExclusaoAberta(false)} disabled={atualizando}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmarExclusao}
            disabled={atualizando}
            startIcon={atualizando ? <CircularProgress size={14} color="inherit" /> : <DeleteIcon />}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default function ListaPedidos() {
  const { pedidos, carregando, erro, criarPedido, atualizarPedido, removerPedido } = usePedidosAdmin()
  const { filtros, pedidosFiltrados, alterarFiltro, limparFiltros, possuiFiltrosAtivos } = useFiltrosPedidos(pedidos)
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [pedidoParaEditar, setPedidoParaEditar] = useState<Pedido | null>(null)

  const handleCriarPedido = async (dados: NovoPedido) => {
    await criarPedido(dados)
  }

  const handleEditarPedido = async (dados: NovoPedido) => {
    if (!pedidoParaEditar) return
    await atualizarPedido(pedidoParaEditar.id, {
      itens: dados.itens,
      total: dados.total,
      forma_pagamento: dados.forma_pagamento,
      taxa_entrega: dados.taxa_entrega,
      criado_em: dados.criado_em,
      nome_cliente: dados.nome_cliente,
      telefone_cliente: dados.telefone_cliente,
    })
  }

  const abrirEdicao = (pedido: Pedido) => {
    setPedidoParaEditar(pedido)
  }

  const fecharEdicao = () => {
    setPedidoParaEditar(null)
  }

  if (carregando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <CabecalhoPagina
        titulo="Pedidos"
        labelBotao="Novo Pedido"
        onClicarBotao={() => setFormularioAberto(true)}
      />

      {erro && <Alert severity="error">{erro}</Alert>}

      <FiltrosPedidosComponent
        filtros={filtros}
        onAlterarFiltro={alterarFiltro}
        onLimparFiltros={limparFiltros}
        possuiFiltrosAtivos={possuiFiltrosAtivos}
      />

      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'background.paper' } }}>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pagamento</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidosFiltrados.map((pedido) => (
              <LinhaExpandivel
                key={pedido.id}
                pedido={pedido}
                onAtualizar={atualizarPedido}
                onRemover={removerPedido}
                onEditar={abrirEdicao}
              />
            ))}
            {pedidosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">Nenhum pedido encontrado</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <FormularioPedido
        aberto={formularioAberto}
        onFechar={() => setFormularioAberto(false)}
        onSalvar={handleCriarPedido}
      />

      <FormularioPedido
        aberto={pedidoParaEditar !== null}
        onFechar={fecharEdicao}
        onSalvar={handleEditarPedido}
        pedidoParaEditar={pedidoParaEditar ?? undefined}
      />
    </Box>
  )
}
