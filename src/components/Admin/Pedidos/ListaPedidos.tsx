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
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { usePedidosAdmin } from '@/hooks/usePedidosAdmin'
import type { Pedido, StatusPedido, NovoPedido, ItemPedido } from '@/types/pedido'
import { todosStatusPedido } from '@/types/pedido'
import FormularioPedido from './FormularioPedido'

const coresPorStatus: Record<StatusPedido, 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error'> = {
  'aguardando confirmação': 'warning',
  'confirmado': 'info',
  'em preparo': 'primary',
  'enviado': 'secondary',
  'entregue': 'success',
  'cancelado': 'error',
}

type PropsLinhaExpandivel = {
  pedido: Pedido
  onAtualizarStatus: (id: string, status: StatusPedido) => Promise<void>
  onAtualizarItens: (id: string, itens: ItemPedido[], total: number) => Promise<void>
}

function LinhaExpandivel({ pedido, onAtualizarStatus, onAtualizarItens }: PropsLinhaExpandivel) {
  const [expandido, setExpandido] = useState(false)
  const [atualizando, setAtualizando] = useState(false)
  const [editandoPrecos, setEditandoPrecos] = useState(false)
  const [itensPedidoEditaveis, setItensPedidoEditaveis] = useState<ItemPedido[]>(pedido.itens)

  const handleStatus = async (novoStatus: StatusPedido) => {
    setAtualizando(true)
    try {
      await onAtualizarStatus(pedido.id, novoStatus)
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
    const novoTotal = itensPedidoEditaveis.reduce((soma, item) => soma + item.subtotal, 0)
    setAtualizando(true)
    try {
      await onAtualizarItens(pedido.id, itensPedidoEditaveis, novoTotal)
      setEditandoPrecos(false)
    } finally {
      setAtualizando(false)
    }
  }

  const totalEditavel = itensPedidoEditaveis.reduce((soma, item) => soma + item.subtotal, 0)
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
        <TableCell>{dataFormatada}</TableCell>
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
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
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
    </>
  )
}

export default function ListaPedidos() {
  const { pedidos, carregando, erro, criarPedido, atualizarPedido } = usePedidosAdmin()
  const [formularioAberto, setFormularioAberto] = useState(false)

  const handleAtualizarStatus = async (id: string, status: StatusPedido) => {
    await atualizarPedido(id, { status })
  }

  const handleAtualizarItens = async (id: string, itens: ItemPedido[], total: number) => {
    await atualizarPedido(id, { itens, total })
  }

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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Pedidos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormularioAberto(true)}
          sx={{ borderRadius: '50px' }}
        >
          Novo Pedido
        </Button>
      </Box>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

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
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <LinhaExpandivel
                key={pedido.id}
                pedido={pedido}
                onAtualizarStatus={handleAtualizarStatus}
                onAtualizarItens={handleAtualizarItens}
              />
            ))}
            {pedidos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
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

