'use client'

import { useState, useEffect, useRef } from 'react'
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
import Typography from '@mui/material/Typography'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import type { Item, NovoItem, EdicaoItem } from '@/types/item'
import { redimensionarImagemNoCliente } from '@/lib/itens/redimensionarImagemNoCliente'

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
  custo: null,
  promocao_ativa: null,
  estoque: 0,
  ativo: true,
  codigo_barras: null,
}

export default function FormularioItem({ aberto, onFechar, itemEdicao, onSalvar }: PropsFormularioItem) {
  const [dados, setDados] = useState<NovoItem>(valoresIniciais)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [previewCarregando, setPreviewCarregando] = useState(false)
  const [previewErro, setPreviewErro] = useState(false)
  const [estaFazendoUploadDeImagem, setEstaFazendoUploadDeImagem] = useState(false)
  const inputArquivoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDados(itemEdicao ? {
      nome: itemEdicao.nome,
      descricao: itemEdicao.descricao,
      imagem_url: itemEdicao.imagem_url,
      preco: itemEdicao.preco,
      custo: itemEdicao.custo ?? null,
      promocao_ativa: itemEdicao.promocao_ativa ?? null,
      estoque: itemEdicao.estoque,
      ativo: itemEdicao.ativo,
      codigo_barras: itemEdicao.codigo_barras ?? null,
    } : valoresIniciais)
    setErro(null)
    if (itemEdicao && itemEdicao.imagem_url) {
      carregarPreviewDeUrl(itemEdicao.imagem_url)
    } else {
      setPreviewSrc(null)
      setPreviewErro(false)
    }
  }, [itemEdicao, aberto])

  useEffect(() => {
    if (!dados.imagem_url) {
      setPreviewSrc(null)
      setPreviewErro(false)
      return
    }
    carregarPreviewDeUrl(dados.imagem_url)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dados.imagem_url])

  const carregarPreviewDeUrl = (url: string) => {
    setPreviewCarregando(true)
    setPreviewErro(false)
    const img = new Image()
    img.onload = () => {
      setPreviewSrc(url)
      setPreviewCarregando(false)
      setPreviewErro(false)
    }
    img.onerror = () => {
      setPreviewSrc(null)
      setPreviewCarregando(false)
      setPreviewErro(true)
    }
    img.src = url
  }

  const handleArquivoSelecionado = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return

    setEstaFazendoUploadDeImagem(true)
    setErro(null)

    try {
      const arquivoRedimensionado = await redimensionarImagemNoCliente(arquivo)
      const formData = new FormData()
      formData.append('arquivo', arquivoRedimensionado)

      const resposta = await fetch('/api/admin/itens/imagem', {
        method: 'POST',
        body: formData,
      })

      if (!resposta.ok) throw new Error('Falha no upload')

      const { url } = await resposta.json()
      handleChange('imagem_url', url)
    } catch {
      setErro('Erro ao fazer upload da imagem. Tente novamente.')
    } finally {
      setEstaFazendoUploadDeImagem(false)
      if (inputArquivoRef.current) inputArquivoRef.current.value = ''
    }
  }

  const handleChange = (campo: keyof NovoItem, valor: string | number | boolean | null) => {
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
                disabled={estaFazendoUploadDeImagem}
              />
            </Grid>
            <Grid size={12}>
              <input
                ref={inputArquivoRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleArquivoSelecionado}
              />
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={() => inputArquivoRef.current?.click()}
                fullWidth
                disabled={estaFazendoUploadDeImagem}
                sx={{ borderRadius: '8px', py: 1.5 }}
              >
                Carregar imagem do computador
              </Button>
            </Grid>
            <Grid size={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 120, height: 120, bgcolor: 'background.default', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                  {estaFazendoUploadDeImagem ? (
                    <CircularProgress size={24} />
                  ) : previewCarregando ? (
                    <CircularProgress size={24} />
                  ) : previewSrc ? (
                    <Box component="img" src={previewSrc} alt="Preview" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : previewErro ? (
                    <Box sx={{ px: 1, textAlign: 'center', color: 'text.secondary' }}>Preview indisponível</Box>
                  ) : (
                    <Box sx={{ px: 1, textAlign: 'center', color: 'text.secondary' }}>Sem imagem</Box>
                  )}
                </Box>
                <Box>
                  <Typography component="span" sx={{ display: 'block', fontWeight: 600 }}>Preview da Imagem</Typography>
                  {dados.imagem_url ? (
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {dados.imagem_url}
                      </Typography>
                      <Button size="small" color="error" onClick={() => handleChange('imagem_url', '')} sx={{ mt: 0.5, px: 0 }}>
                        Remover imagem
                      </Button>
                    </Box>
                  ) : (
                    <Typography sx={{ color: 'text.secondary', maxWidth: 360 }}>
                      Cole uma URL ou carregue uma imagem
                    </Typography>
                  )}
                </Box>
              </Box>
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
                label="Custo (R$)"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={dados.custo != null ? dados.custo : ''}
                onChange={(e) => handleChange('custo', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Deixe vazio se não souber"
                helperText="Usado para calcular o lucro por item vendido"
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Promoção Ativa (R$)"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={dados.promocao_ativa != null ? dados.promocao_ativa : ''}
                onChange={(e) => handleChange('promocao_ativa', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Deixe vazio para desativar"
                helperText={dados.promocao_ativa != null ? 'Preço original será exibido riscado no catálogo' : 'Sem promoção ativa'}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Código de Barras"
                value={dados.codigo_barras ?? ''}
                onChange={(e) => handleChange('codigo_barras', e.target.value || null)}
                placeholder="Ex: 7891234567890"
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
