'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import type { Gasto, NovoGasto, EdicaoGasto, TipoGasto } from '@/types/gasto'

type PropsFormularioGasto = {
  aberto: boolean
  onFechar: () => void
  gastoEdicao?: Gasto | null
  onSalvar: (dados: NovoGasto | EdicaoGasto) => Promise<void>
}

const valoresIniciais: NovoGasto = {
  descricao: '',
  valor: 0,
  tipo: 'recorrente',
  categoria: '',
  data_inicio: new Date().toISOString().slice(0, 10),
  total_parcelas: null,
  status: 'pendente',
}

const labelsTipo: Record<TipoGasto, string> = {
  unico: 'Único (uma vez)',
  recorrente: 'Recorrente (mensal, sem fim)',
  parcelado: 'Parcelado (mensal, com limite de parcelas)',
}

export default function FormularioGasto({ aberto, onFechar, gastoEdicao, onSalvar }: PropsFormularioGasto) {
  const [dados, setDados] = useState<NovoGasto>(valoresIniciais)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (gastoEdicao) {
      setDados({
        descricao: gastoEdicao.descricao,
        valor: gastoEdicao.valor,
        tipo: gastoEdicao.tipo,
        categoria: gastoEdicao.categoria ?? '',
        data_inicio: gastoEdicao.data_inicio,
        total_parcelas: gastoEdicao.total_parcelas ?? null,
        numero_parcela: gastoEdicao.numero_parcela ?? null,
        status: gastoEdicao.status,
      })
    } else {
      setDados(valoresIniciais)
    }
    setErro(null)
  }, [gastoEdicao, aberto])

  const handleChange = <K extends keyof NovoGasto>(campo: K, valor: NovoGasto[K]) => {
    setDados((anterior) => ({ ...anterior, [campo]: valor }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    setErro(null)
    try {
      const dadosParaSalvar: NovoGasto = {
        ...dados,
        total_parcelas: dados.tipo === 'parcelado' ? dados.total_parcelas : null,
        categoria: dados.categoria || null,
      }
      await onSalvar(dadosParaSalvar)
      onFechar()
    } catch {
      setErro('Erro ao salvar gasto. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: { xs: '8px', sm: '16px' }, margin: { xs: 1, sm: 3 }, width: '100%' } }}>
      <DialogTitle fontWeight={700}>
        {gastoEdicao ? 'Editar Gasto' : 'Novo Gasto'}
      </DialogTitle>
      <DialogContent>
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        <Box component="form" id="formulario-gasto" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={dados.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                required
                placeholder="Ex: Aluguel, Internet, Salário..."
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Valor (R$)"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={dados.valor}
                onChange={(e) => handleChange('valor', parseFloat(e.target.value) || 0)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Categoria"
                value={dados.categoria ?? ''}
                onChange={(e) => handleChange('categoria', e.target.value)}
                placeholder="Ex: Infraestrutura, Pessoal..."
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                select
                label="Tipo de Gasto"
                value={dados.tipo}
                onChange={(e) => handleChange('tipo', e.target.value as TipoGasto)}
                required
              >
                {(Object.entries(labelsTipo) as [TipoGasto, string][]).map(([valor, label]) => (
                  <MenuItem key={valor} value={valor}>{label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: dados.tipo === 'parcelado' ? 6 : 12 }}>
              <TextField
                fullWidth
                label={dados.tipo === 'unico' ? 'Data do Pagamento' : 'Data de Início'}
                type="date"
                value={dados.data_inicio}
                onChange={(e) => handleChange('data_inicio', e.target.value)}
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            {dados.tipo === 'parcelado' && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Total de Parcelas"
                  type="number"
                  inputProps={{ min: 2 }}
                  value={dados.total_parcelas ?? ''}
                  onChange={(e) => handleChange('total_parcelas', parseInt(e.target.value) || null)}
                  required
                  placeholder="Ex: 12"
                />
              </Grid>
            )}
            <Grid size={12}>
              {/* Status gerenciado pelo banco; usuário verá/alterará status ao marcar como pago via edição */}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onFechar} disabled={salvando}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="formulario-gasto"
          variant="contained"
          disabled={salvando}
          sx={{ borderRadius: '50px', px: 4 }}
        >
          {salvando ? <CircularProgress size={20} color="inherit" /> : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
