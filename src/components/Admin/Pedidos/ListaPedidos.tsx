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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { usePedidosAdmin } from '@/hooks/usePedidosAdmin'
import type { Pedido, StatusPedido } from '@/types/pedido'
import { todosStatusPedido } from '@/types/pedido'

const coresPorStatus: Record<StatusPedido, 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error'> = {
  'aguardando confirmação': 'warning',
  'confirmado': 'info',
  'em preparo': 'primary',
  'enviado': 'secondary',
  'entregue': 'success',
  'cancelado': 'error',
}

function LinhaExpandivel({ pedido, onAtualizarStatus }: { pedido: Pedido; onAtualizarStatus: (id: string, status: StatusPedido) => Promise<void> }) {
  const [expandido, setExpandido] = useState(false)
  const [atualizando, setAtualizando] = useState(false)

  const handleStatus = async (novoStatus: StatusPedido) => {
    setAtualizando(true)
    try {
      await onAtualizarStatus(pedido.id, novoStatus)
    } finally {
      setAtualizando(false)
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
    </>
  )
}

export default function ListaPedidos() {
  const { pedidos, carregando, erro, atualizarPedido } = usePedidosAdmin()

  const handleAtualizarStatus = async (id: string, status: StatusPedido) => {
    await atualizarPedido(id, { status })
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
    </Box>
  )
}
