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
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CabecalhoPagina from '../CabecalhoPagina'
import { usePedidosAdmin } from '@/hooks/usePedidosAdmin'
import { useFiltrosPedidos } from '@/hooks/useFiltrosPedidos'
import type { Pedido, StatusPedido, FormaPagamento, NovoPedido, ItemPedido, EdicaoPedido } from '@/types/pedido'
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
}

const isoParaInputDatetime = (isoString: string): string => {
  const date = new Date(isoString)
  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function LinhaExpandivel({ pedido, onAtualizar, onRemover }: PropsLinhaExpandivel) {
  const [expandido, setExpandido] = useState(false)
  const [atualizando, setAtualizando] = useState(false)
  const [editandoPrecos, setEditandoPrecos] = useState(false)
  const [itensPedidoEditaveis, setItensPedidoEditaveis] = useState<ItemPedido[]>(pedido.itens)
  const [confirmacaoExclusaoAberta, setConfirmacaoExclusaoAberta] = useState(false)
  const [editandoData, setEditandoData] = useState(false)
  const [dataEditavel, setDataEditavel] = useState(isoParaInputDatetime(pedido.criado_em))

  const iniciarEdicaoData = () => {
    setDataEditavel(isoParaInputDatetime(pedido.criado_em))
    setEditandoData(true)
  }

  const cancelarEdicaoData = () => {
    setDataEditavel(isoParaInputDatetime(pedido.criado_em))
    setEditandoData(false)
  }

  const salvarEdicaoData = async () => {
    if (!dataEditavel) return
    setAtualizando(true)
    try {
      await onAtualizar(pedido.id, { criado_em: new Date(dataEditavel).toISOString() })
      setEditandoData(false)
    } finally {
      setAtualizando(false)
    }
  }

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

  const iniciarEdicaoPrecos = () => {
    setItensPedidoEditaveis(pedido.itens)
    setEditandoPrecos(true)
  }

  const cancelarEdicaoPrecos = () => {
    setItensPedidoEditaveis(pedido.itens)
    setEditandoPrecos(false)
  }

  const alterarPrecoItem = (index: number, novoPreco: number) => {
    setItensPedidoEditaveis(prev => prev.map((item, i) => {
      if (i !== index) return item
      return { ...item, preco: novoPreco, subtotal: novoPreco * item.quantidade }
    }))
  }

  const salvarEdicaoPrecos = async () => {
    const algumPrecoInvalido = itensPedidoEditaveis.some(item => item.preco <= 0)
    if (algumPrecoInvalido) return
    const novoTotal = itensPedidoEditaveis.reduce((soma, item) => soma + item.subtotal, 0) + pedido.taxa_entrega
    setAtualizando(true)
    try {
      await onAtualizar(pedido.id, { itens: itensPedidoEditaveis, total: novoTotal })
      setEditandoPrecos(false)
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

  const totalEditavel = itensPedidoEditaveis.reduce((soma, item) => soma + item.subtotal, 0) + pedido.taxa_entrega
  const algumPrecoInvalido = itensPedidoEditaveis.some(item => item.preco <= 0)

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
          {editandoData ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TextField
                size="small"
                type="datetime-local"
                value={dataEditavel}
                onChange={(e) => setDataEditavel(e.target.value)}
                disabled={atualizando}
                sx={{ width: '195px' }}
              />
              <IconButton size="small" color="primary" onClick={salvarEdicaoData} disabled={atualizando || !dataEditavel}>
                {atualizando ? <CircularProgress size={16} color="inherit" /> : <SaveIcon fontSize="small" />}
              </IconButton>
              <IconButton size="small" onClick={cancelarEdicaoData} disabled={atualizando}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2">{dataFormatada}</Typography>
              <IconButton size="small" onClick={iniciarEdicaoData} disabled={atualizando} sx={{ opacity: 0.4, '&:hover': { opacity: 1 } }}>
                <EditIcon sx={{ fontSize: '0.9rem' }} />
              </IconButton>
            </Box>
          )}
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Itens do Pedido
                </Typography>
                {!editandoPrecos ? (
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={iniciarEdicaoPrecos}
                    disabled={atualizando}
                  >
                    Editar preços
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={atualizando ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
                      onClick={salvarEdicaoPrecos}
                      disabled={atualizando || algumPrecoInvalido}
                    >
                      Salvar
                    </Button>
                    <Button
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={cancelarEdicaoPrecos}
                      disabled={atualizando}
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </Box>
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
                  {(editandoPrecos ? itensPedidoEditaveis : pedido.itens).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell align="right">
                        {editandoPrecos ? (
                          <TextField
                            size="small"
                            type="number"
                            value={item.preco}
                            inputProps={{ min: 0.01, step: '0.01' }}
                            sx={{ width: '110px', '& input': { textAlign: 'right' } }}
                            onChange={(e) => alterarPrecoItem(index, parseFloat(e.target.value) || 0)}
                            error={item.preco <= 0}
                          />
                        ) : (
                          `R$ ${item.preco.toFixed(2).replace('.', ',')}`
                        )}
                      </TableCell>
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
                      R$ {(editandoPrecos ? totalEditavel : pedido.total).toFixed(2).replace('.', ',')}
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

  const handleCriarPedido = async (dados: NovoPedido) => {
    await criarPedido(dados)
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
    </Box>
  )
}
