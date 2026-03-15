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
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import type { NovoPedido, ItemPedido, FormaPagamento, Pedido } from '@/types/pedido'
import { todasFormasPagamento, TAXA_ENTREGA_PADRAO } from '@/types/pedido'
import type { Item } from '@/types/item'

type PropsFormularioPedido = {
  aberto: boolean
  onFechar: () => void
  onSalvar: (dados: NovoPedido) => Promise<void>
  pedidoParaEditar?: Pedido
}

const dadosClienteIniciais = { nome_cliente: '', telefone_cliente: '' }
const obterDataAtualParaCampoDatetime = () => {
  const agora = new Date()
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset())
  return agora.toISOString().slice(0, 16)
}

const isoParaInputDatetime = (isoString: string): string => {
  const date = new Date(isoString)
  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

export default function FormularioPedido({ aberto, onFechar, onSalvar, pedidoParaEditar }: PropsFormularioPedido) {
  const [dadosCliente, setDadosCliente] = useState(dadosClienteIniciais)
  const [dataPedido, setDataPedido] = useState(obterDataAtualParaCampoDatetime)
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | ''>('')
  const [itensCatalogo, setItensCatalogo] = useState<Item[]>([])
  const [itemSelecionadoId, setItemSelecionadoId] = useState('')
  const [precoItemSelecionado, setPrecoItemSelecionado] = useState<number | ''>('')
  const [quantidadeItemSelecionado, setQuantidadeItemSelecionado] = useState(1)
  const [itensDoPedido, setItensDoPedido] = useState<ItemPedido[]>([])
  const [teleEntrega, setTeleEntrega] = useState(false)
  const [taxaEntrega, setTaxaEntrega] = useState<number>(TAXA_ENTREGA_PADRAO)
  const [precisaDeTroco, setPrecisaDeTroco] = useState(false)
  const [valorPagoEmDinheiro, setValorPagoEmDinheiro] = useState<number | ''>('')
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
      if (pedidoParaEditar) {
        setDadosCliente({ nome_cliente: pedidoParaEditar.nome_cliente, telefone_cliente: pedidoParaEditar.telefone_cliente })
        setDataPedido(isoParaInputDatetime(pedidoParaEditar.criado_em))
        setFormaPagamento(pedidoParaEditar.forma_pagamento ?? '')
        setItensDoPedido(pedidoParaEditar.itens)
        const temEntrega = pedidoParaEditar.taxa_entrega > 0
        setTeleEntrega(temEntrega)
        setTaxaEntrega(temEntrega ? pedidoParaEditar.taxa_entrega : TAXA_ENTREGA_PADRAO)
      } else {
        setDadosCliente(dadosClienteIniciais)
        setDataPedido(obterDataAtualParaCampoDatetime())
        setFormaPagamento('')
        setItensDoPedido([])
        setTeleEntrega(false)
        setTaxaEntrega(TAXA_ENTREGA_PADRAO)
      }
      setPrecisaDeTroco(false)
      setValorPagoEmDinheiro('')
      setItemSelecionadoId('')
      setPrecoItemSelecionado('')
      setQuantidadeItemSelecionado(1)
      setErro(null)
      buscarItensCatalogo()
    }
  }, [aberto, pedidoParaEditar, buscarItensCatalogo])

  const totalDoPedido = itensDoPedido.reduce((soma, item) => soma + item.subtotal, 0)
  const taxaEntregaFinal = teleEntrega ? taxaEntrega : 0
  const totalComEntrega = totalDoPedido + taxaEntregaFinal

  const pagamentoEhDinheiro = formaPagamento === 'dinheiro'
  const trocoCalculado = precisaDeTroco && pagamentoEhDinheiro && typeof valorPagoEmDinheiro === 'number'
    ? valorPagoEmDinheiro - totalComEntrega
    : null

  const atalhosTroco = [20, 50, 100, 200].filter(valor => valor >= totalComEntrega)

  const alterarFormaPagamento = (novaForma: FormaPagamento | '') => {
    setFormaPagamento(novaForma)
    if (novaForma !== 'dinheiro') {
      setPrecisaDeTroco(false)
      setValorPagoEmDinheiro('')
    }
  }

  const adicionarItemAoPedido = () => {
    const itemCatalogo = itensCatalogo.find(i => i.id === itemSelecionadoId)
    if (!itemCatalogo) return

    const precoFinal = typeof precoItemSelecionado === 'number' && precoItemSelecionado > 0
      ? precoItemSelecionado
      : itemCatalogo.preco

    const indiceExistente = itensDoPedido.findIndex(i => i.id === itemSelecionadoId)
    if (indiceExistente >= 0) {
      setItensDoPedido(anterior => anterior.map((item, index) => {
        if (index !== indiceExistente) return item
        const novaQuantidade = item.quantidade + quantidadeItemSelecionado
        return { ...item, quantidade: novaQuantidade, subtotal: precoFinal * novaQuantidade }
      }))
    } else {
      const novoItem: ItemPedido = {
        id: itemCatalogo.id,
        nome: itemCatalogo.nome,
        preco: precoFinal,
        quantidade: quantidadeItemSelecionado,
        subtotal: precoFinal * quantidadeItemSelecionado,
      }
      setItensDoPedido(anterior => [...anterior, novoItem])
    }

    setItemSelecionadoId('')
    setPrecoItemSelecionado('')
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
      await onSalvar({
        ...dadosCliente,
        forma_pagamento: formaPagamento === '' ? null : formaPagamento,
        itens: itensDoPedido,
        total: totalComEntrega,
        taxa_entrega: taxaEntregaFinal,
        criado_em: new Date(dataPedido).toISOString(),
      })
      onFechar()
    } catch {
      setErro('Erro ao salvar pedido. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle fontWeight={700}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          {pedidoParaEditar ? 'Editar Pedido' : 'Novo Pedido'}
          {pedidoParaEditar && (
            <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>
              #{pedidoParaEditar.id}
            </Typography>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        <Box component="form" id="formulario-pedido" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>

            <Grid size={12}>
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
                <Grid size={{ xs: 12, sm: 5 }}>
                  <FormControl fullWidth>
                    <InputLabel>Produto</InputLabel>
                    <Select
                      value={itemSelecionadoId}
                      label="Produto"
                      onChange={(e) => {
                        const id = e.target.value
                        setItemSelecionadoId(id)
                        const itemCatalogo = itensCatalogo.find(i => i.id === id)
                        setPrecoItemSelecionado(itemCatalogo ? itemCatalogo.preco : '')
                      }}
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
                    label="Preço Unit. (R$)"
                    type="number"
                    inputProps={{ min: 0, step: '0.01' }}
                    value={precoItemSelecionado}
                    onChange={(e) => setPrecoItemSelecionado(parseFloat(e.target.value) || '')}
                    disabled={!itemSelecionadoId}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Quantidade"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={quantidadeItemSelecionado}
                    onChange={(e) => setQuantidadeItemSelecionado(parseInt(e.target.value) || 1)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
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
                    {teleEntrega && (
                      <TableRow>
                        <TableCell colSpan={3} align="right" sx={{ color: 'text.secondary' }}>Tele-entrega</TableCell>
                        <TableCell align="right" sx={{ color: 'text.secondary' }}>
                          R$ {taxaEntregaFinal.toFixed(2).replace('.', ',')}
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        R$ {totalComEntrega.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            )}

            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Pagamento
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Forma de Pagamento</InputLabel>
                <Select
                  value={formaPagamento}
                  label="Forma de Pagamento"
                  onChange={(e) => alterarFormaPagamento(e.target.value as FormaPagamento | '')}
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
            </Grid>

            {pagamentoEhDinheiro && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={precisaDeTroco}
                        onChange={(e) => {
                          setPrecisaDeTroco(e.target.checked)
                          if (!e.target.checked) setValorPagoEmDinheiro('')
                        }}
                        color="primary"
                      />
                    }
                    label="Precisa de troco?"
                  />
                </Grid>
                {precisaDeTroco && (
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {atalhosTroco.map(valor => (
                          <Chip
                            key={valor}
                            label={`R$ ${valor}`}
                            onClick={() => setValorPagoEmDinheiro(valor)}
                            variant={valorPagoEmDinheiro === valor ? 'filled' : 'outlined'}
                            color={valorPagoEmDinheiro === valor ? 'primary' : 'default'}
                            sx={{ fontWeight: 600 }}
                          />
                        ))}
                      </Box>
                      <TextField
                        label="Valor pago"
                        type="number"
                        inputProps={{ min: 0, step: '0.01' }}
                        value={valorPagoEmDinheiro}
                        onChange={(e) => setValorPagoEmDinheiro(parseFloat(e.target.value) || '')}
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                          },
                        }}
                        sx={{ maxWidth: 200 }}
                        autoFocus
                      />
                      {trocoCalculado !== null && (
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 1,
                            borderRadius: '8px',
                            bgcolor: trocoCalculado >= 0 ? 'success.light' : 'error.light',
                            color: trocoCalculado >= 0 ? 'success.contrastText' : 'error.contrastText',
                            alignSelf: 'flex-start',
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {trocoCalculado >= 0
                              ? `Troco: R$ ${trocoCalculado.toFixed(2).replace('.', ',')}`
                              : `Falta: R$ ${Math.abs(trocoCalculado).toFixed(2).replace('.', ',')}`}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                )}
              </>
            )}

            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Data
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Data do Pedido"
                type="datetime-local"
                value={dataPedido}
                onChange={(e) => setDataPedido(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                required
              />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Entrega
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={teleEntrega}
                    onChange={(e) => setTeleEntrega(e.target.checked)}
                    color="primary"
                  />
                }
                label="Tele-entrega"
              />
            </Grid>
            {teleEntrega && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Taxa de Entrega (R$)"
                  type="number"
                  inputProps={{ min: 0, step: '0.01' }}
                  value={taxaEntrega}
                  onChange={(e) => setTaxaEntrega(parseFloat(e.target.value) || 0)}
                />
              </Grid>
            )}

            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Dados do Cliente
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Nome do Cliente"
                value={dadosCliente.nome_cliente}
                onChange={(e) => setDadosCliente(prev => ({ ...prev, nome_cliente: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Telefone do Cliente"
                value={dadosCliente.telefone_cliente}
                onChange={(e) => setDadosCliente(prev => ({ ...prev, telefone_cliente: e.target.value }))}
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
          form="formulario-pedido"
          variant="contained"
          disabled={salvando || itensDoPedido.length === 0}
          sx={{ borderRadius: '50px', px: 4 }}
        >
          {salvando ? <CircularProgress size={20} color="inherit" /> : (pedidoParaEditar ? 'Salvar Alterações' : 'Criar Pedido')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
