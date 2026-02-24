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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import type { Item, NovoItem, EdicaoItem } from '@/types/item'

type PropsFormularioItem = {
  aberto: boolean
  onFechar: () => void
  itemEdicao?: Item | null
  onSalvar: (dados: NovoItem | EdicaoItem) => Promise<void>
}

const valoresIniciais: NovoItem = {
  nome: '',
  descricao: '',
  imagem_url: '',
  preco: 0,
  estoque: 0,
  ativo: true,
}

export default function FormularioItem({ aberto, onFechar, itemEdicao, onSalvar }: PropsFormularioItem) {
  const [dados, setDados] = useState<NovoItem>(valoresIniciais)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    setDados(itemEdicao ? {
      nome: itemEdicao.nome,
      descricao: itemEdicao.descricao,
      imagem_url: itemEdicao.imagem_url,
      preco: itemEdicao.preco,
      estoque: itemEdicao.estoque,
      ativo: itemEdicao.ativo,
    } : valoresIniciais)
    setErro(null)
  }, [itemEdicao, aberto])

  const handleChange = (campo: keyof NovoItem, valor: string | number | boolean) => {
    setDados((anterior) => ({ ...anterior, [campo]: valor }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    setErro(null)
    try {
      await onSalvar(dados)
      onFechar()
      setDados(valoresIniciais)
    } catch {
      setErro('Erro ao salvar item. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle fontWeight={700}>
        {itemEdicao ? 'Editar Item' : 'Novo Item'}
      </DialogTitle>
      <DialogContent>
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        <Box component="form" id="formulario-item" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Nome"
                value={dados.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={dados.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="URL da Imagem"
                value={dados.imagem_url}
                onChange={(e) => handleChange('imagem_url', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Preço (R$)"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={dados.preco}
                onChange={(e) => handleChange('preco', parseFloat(e.target.value) || 0)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Estoque"
                type="number"
                inputProps={{ min: 0 }}
                value={dados.estoque}
                onChange={(e) => handleChange('estoque', parseInt(e.target.value) || 0)}
                required
              />
            </Grid>
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={dados.ativo}
                    onChange={(e) => handleChange('ativo', e.target.checked)}
                    color="primary"
                  />
                }
                label="Ativo no catálogo"
              />
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
          form="formulario-item"
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
