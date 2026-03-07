'use client'

import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import type { NovoPedido, ItemPedido } from '@/types/pedido'
import type { Item } from '@/types/item'

type PropsFormularioPedido = {
  aberto: boolean
  onFechar: () => void
  onSalvar: (dados: NovoPedido) => Promise<void>
}

const dadosClienteIniciais = { nome_cliente: '', telefone_cliente: '' }

export default function FormularioPedido({ aberto, onFechar, onSalvar }: PropsFormularioPedido) {
  const [dadosCliente, setDadosCliente] = useState(dadosClienteIniciais)
  const [itensCatalogo, setItensCatalogo] = useState<Item[]>([])
  const [itemSelecionadoId, setItemSelecionadoId] = useState('')
  const [quantidadeItemSelecionado, setQuantidadeItemSelecionado] = useState(1)
  const [itensDoPedido, setItensDoPedido] = useState<ItemPedido[]>([])
  const [salvando, setSalvando] = useState(false)
  const [carregandoItens, setCarregandoItens] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const buscarItensCatalogo = useCallback(async () => {
    setCarregandoItens(true)
    try {
      const resposta = await fetch('/api/admin/itens')
      if (!resposta.ok) throw new Error('Falha ao buscar itens do catálogo')
      const dados = await resposta.json()
      setItensCatalogo(dados.filter((item: Item) => item.ativo))
    } catch {
      setErro('Erro ao carregar itens do catálogo')
    } finally {
      setCarregandoItens(false)
    }
  }, [])

  useEffect(() => {
    if (aberto) {
      setDadosCliente(dadosClienteIniciais)
      setItensDoPedido([])
      setItemSelecionadoId('')
      setQuantidadeItemSelecionado(1)
      setErro(null)
      buscarItensCatalogo()
    }
  }, [aberto, buscarItensCatalogo])

  const totalDoPedido = itensDoPedido.reduce((soma, item) => soma + item.subtotal, 0)

  const adicionarItemAoPedido = () => {
    const itemCatalogo = itensCatalogo.find(i => i.id === itemSelecionadoId)
    if (!itemCatalogo) return

    const indiceExistente = itensDoPedido.findIndex(i => i.id === itemSelecionadoId)
    if (indiceExistente >= 0) {
      setItensDoPedido(anterior => anterior.map((item, index) => {
        if (index !== indiceExistente) return item
        const novaQuantidade = item.quantidade + quantidadeItemSelecionado
        return { ...item, quantidade: novaQuantidade, subtotal: itemCatalogo.preco * novaQuantidade }
      }))
    } else {
      const novoItem: ItemPedido = {
        id: itemCatalogo.id,
        nome: itemCatalogo.nome,
        preco: itemCatalogo.preco,
        quantidade: quantidadeItemSelecionado,
        subtotal: itemCatalogo.preco * quantidadeItemSelecionado,
      }
      setItensDoPedido(anterior => [...anterior, novoItem])
    }

    setItemSelecionadoId('')
    setQuantidadeItemSelecionado(1)
  }

  const removerItemDoPedido = (id: string) => {
    setItensDoPedido(anterior => anterior.filter(item => item.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (itensDoPedido.length === 0) {
      setErro('Adicione pelo menos um item ao pedido')
      return
    }
    setSalvando(true)
    setErro(null)
    try {
      await onSalvar({ ...dadosCliente, itens: itensDoPedido, total: totalDoPedido })
      onFechar()
    } catch {
      setErro('Erro ao criar pedido. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle fontWeight={700}>Novo Pedido</DialogTitle>
      <DialogContent>
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        <Box component="form" id="formulario-pedido" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="subtitle1" fontWeight={700}>
                Dados do Cliente
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Nome do Cliente"
                value={dadosCliente.nome_cliente}
                onChange={(e) => setDadosCliente(prev => ({ ...prev, nome_cliente: e.target.value }))}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Telefone do Cliente"
                value={dadosCliente.telefone_cliente}
                onChange={(e) => setDadosCliente(prev => ({ ...prev, telefone_cliente: e.target.value }))}
                required
              />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Itens do Pedido
              </Typography>
            </Grid>

            {carregandoItens ? (
              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              </Grid>
            ) : (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Produto</InputLabel>
                    <Select
                      value={itemSelecionadoId}
                      label="Produto"
                      onChange={(e) => setItemSelecionadoId(e.target.value)}
                    >
                      {itensCatalogo.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.nome} — R$ {item.preco.toFixed(2).replace('.', ',')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    label="Quantidade"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={quantidadeItemSelecionado}
                    onChange={(e) => setQuantidadeItemSelecionado(parseInt(e.target.value) || 1)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={adicionarItemAoPedido}
                    disabled={!itemSelecionadoId}
                    sx={{ height: '56px', borderRadius: '8px' }}
                  >
                    Adicionar
                  </Button>
                </Grid>
              </>
            )}

            {itensDoPedido.length > 0 && (
              <Grid size={12}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell align="right">Preço Unit.</TableCell>
                      <TableCell align="right">Qtd</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itensDoPedido.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.nome}</TableCell>
                        <TableCell align="right">R$ {item.preco.toFixed(2).replace('.', ',')}</TableCell>
                        <TableCell align="right">{item.quantidade}</TableCell>
                        <TableCell align="right">R$ {item.subtotal.toFixed(2).replace('.', ',')}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => removerItemDoPedido(item.id)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        R$ {totalDoPedido.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onFechar} disabled={salvando}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="formulario-pedido"
          variant="contained"
          disabled={salvando || itensDoPedido.length === 0}
          sx={{ borderRadius: '50px', px: 4 }}
        >
          {salvando ? <CircularProgress size={20} color="inherit" /> : 'Criar Pedido'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
