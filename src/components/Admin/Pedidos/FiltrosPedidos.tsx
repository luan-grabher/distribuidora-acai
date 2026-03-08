'use client'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FilterListIcon from '@mui/icons-material/FilterList'
import ClearIcon from '@mui/icons-material/Clear'
import type { FiltrosPedidos } from '@/hooks/useFiltrosPedidos'
import type { StatusPedido, FormaPagamento } from '@/types/pedido'
import { todosStatusPedido, todasFormasPagamento } from '@/types/pedido'

type PropsFiltrosPedidos = {
  filtros: FiltrosPedidos
  onAlterarFiltro: <K extends keyof FiltrosPedidos>(campo: K, valor: FiltrosPedidos[K]) => void
  onLimparFiltros: () => void
  possuiFiltrosAtivos: boolean
}

export default function FiltrosPedidosComponent({
  filtros,
  onAlterarFiltro,
  onLimparFiltros,
  possuiFiltrosAtivos,
}: PropsFiltrosPedidos) {
  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700}>
            Filtros
          </Typography>
        </Box>
        {possuiFiltrosAtivos && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={onLimparFiltros}
            color="inherit"
            sx={{ color: 'text.secondary' }}
          >
            Limpar filtros
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
          gap: 2,
        }}
      >
        <TextField
          label="Data início"
          type="date"
          size="small"
          value={filtros.dataInicio}
          onChange={(e) => onAlterarFiltro('dataInicio', e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Data fim"
          type="date"
          size="small"
          value={filtros.dataFim}
          onChange={(e) => onAlterarFiltro('dataFim', e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Cliente"
          size="small"
          value={filtros.nomeCliente}
          onChange={(e) => onAlterarFiltro('nomeCliente', e.target.value)}
          placeholder="Nome do cliente"
        />

        <FormControl size="small">
          <InputLabel>Pagamento</InputLabel>
          <Select
            value={filtros.formaPagamento}
            label="Pagamento"
            onChange={(e) => onAlterarFiltro('formaPagamento', e.target.value as FormaPagamento | '')}
          >
            <MenuItem value="">
              <Typography variant="body2" color="text.secondary">
                Todos
              </Typography>
            </MenuItem>
            {todasFormasPagamento.map((forma) => (
              <MenuItem key={forma} value={forma} sx={{ textTransform: 'capitalize' }}>
                {forma}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filtros.status}
            label="Status"
            onChange={(e) => onAlterarFiltro('status', e.target.value as StatusPedido | '')}
          >
            <MenuItem value="">
              <Typography variant="body2" color="text.secondary">
                Todos
              </Typography>
            </MenuItem>
            {todosStatusPedido.map((status) => (
              <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  )
}
