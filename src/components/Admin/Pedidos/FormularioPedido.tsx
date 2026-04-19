'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
import BarcodeReaderIcon from '@mui/icons-material/BarcodeReader'
import type { NovoPedido, ItemPedido, FormaPagamento, PagamentoParcial, Pedido } from '@/types/pedido'
import { todasFormasPagamento, TAXA_ENTREGA_PADRAO } from '@/types/pedido'
import type { Item } from '@/types/item'

type PropsFormularioPedido = {
  aberto: boolean
  onFechar: () => void
  onSalvar: (dados: NovoPedido) => Promise<void>
  pedidoParaEditar?: Pedido
}

const INTERVALO_MAXIMO_ENTRE_CARACTERES_DO_LEITOR_MS = 50
const COMPRIMENTO_MINIMO_CODIGO_DE_BARRAS = 4

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
  const [pagamentos, setPagamentos] = useState<PagamentoParcial[]>([])
  const [novaFormaPagamento, setNovaFormaPagamento] = useState<FormaPagamento | ''>('')
  const [novoValorPagamento, setNovoValorPagamento] = useState<number | ''>('')
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

  const refContainerSelectProduto = useRef<HTMLDivElement>(null)
  const refInputQuantidade = useRef<HTMLInputElement>(null)
  const timerResetSessaoDigitacaoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const emSessaoDigitacaoQuantidadeRef = useRef(false)
  const precisaFocarSelectProdutoAposCarregamentoRef = useRef(false)

  const barcodeBufferRef = useRef<string>('')
  const barcodeStampsRef = useRef<number[]>([])
  const barcodeTimerLimparRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const itemIdEmSessaoEdicaoTabelaRef = useRef<string | null>(null)
  const emSessaoEdicaoQuantidadeTabelaRef = useRef(false)
  const timerSessaoEdicaoQuantidadeTabelaRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const focarSelectProduto = useCallback(() => {
    refContainerSelectProduto.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()
  }, [])

  const reiniciarSessaoDigitacaoQuantidade = useCallback(() => {
    emSessaoDigitacaoQuantidadeRef.current = false
    if (timerResetSessaoDigitacaoRef.current) clearTimeout(timerResetSessaoDigitacaoRef.current)
  }, [])

  useEffect(() => {
    if (aberto) {
      precisaFocarSelectProdutoAposCarregamentoRef.current = true
      if (pedidoParaEditar) {
        setDadosCliente({ nome_cliente: pedidoParaEditar.nome_cliente, telefone_cliente: pedidoParaEditar.telefone_cliente })
        setDataPedido(isoParaInputDatetime(pedidoParaEditar.criado_em))
        setPagamentos(
          pedidoParaEditar.pagamentos?.length > 0
            ? pedidoParaEditar.pagamentos
            : pedidoParaEditar.forma_pagamento
              ? [{ forma: pedidoParaEditar.forma_pagamento, valor: pedidoParaEditar.total }]
              : []
        )
        setItensDoPedido(pedidoParaEditar.itens)
        const temEntrega = pedidoParaEditar.taxa_entrega > 0
        setTeleEntrega(temEntrega)
        setTaxaEntrega(temEntrega ? pedidoParaEditar.taxa_entrega : TAXA_ENTREGA_PADRAO)
      } else {
        setDadosCliente(dadosClienteIniciais)
        setDataPedido(obterDataAtualParaCampoDatetime())
        setPagamentos([])
        setItensDoPedido([])
        setTeleEntrega(false)
        setTaxaEntrega(TAXA_ENTREGA_PADRAO)
      }
      setNovaFormaPagamento('')
      setNovoValorPagamento('')
      setPrecisaDeTroco(false)
      setValorPagoEmDinheiro('')
      setItemSelecionadoId('')
      setPrecoItemSelecionado('')
      setQuantidadeItemSelecionado(1)
      setErro(null)
      buscarItensCatalogo()
    }
  }, [aberto, pedidoParaEditar, buscarItensCatalogo])

  useEffect(() => {
    if (!carregandoItens && aberto && precisaFocarSelectProdutoAposCarregamentoRef.current) {
      precisaFocarSelectProdutoAposCarregamentoRef.current = false
      requestAnimationFrame(() => focarSelectProduto())
    }
  }, [carregandoItens, aberto, focarSelectProduto])

  useEffect(() => {
    return () => {
      if (timerResetSessaoDigitacaoRef.current) clearTimeout(timerResetSessaoDigitacaoRef.current)
      if (timerSessaoEdicaoQuantidadeTabelaRef.current) clearTimeout(timerSessaoEdicaoQuantidadeTabelaRef.current)
    }
  }, [])

  const totalDoPedido = itensDoPedido.reduce((soma, item) => soma + item.subtotal, 0)
  const taxaEntregaFinal = teleEntrega ? taxaEntrega : 0
  const totalComEntrega = totalDoPedido + taxaEntregaFinal

  const totalJaPago = pagamentos.reduce((soma, p) => soma + p.valor, 0)
  const valorRestanteAPagar = totalComEntrega - totalJaPago

  const pagamentoDinheiro = pagamentos.find(p => p.forma === 'dinheiro')
  const temPagamentoDinheiro = pagamentoDinheiro !== undefined

  const trocoCalculado = precisaDeTroco && temPagamentoDinheiro && typeof valorPagoEmDinheiro === 'number'
    ? valorPagoEmDinheiro - (pagamentoDinheiro?.valor ?? 0)
    : null

  const atalhosTroco = [20, 50, 100, 200].filter(valor => pagamentoDinheiro && valor >= (pagamentoDinheiro.valor ?? 0))

  const adicionarPagamento = () => {
    if (!novaFormaPagamento) return
    const valorFinal = typeof novoValorPagamento === 'number' && novoValorPagamento > 0
      ? novoValorPagamento
      : Math.max(0, valorRestanteAPagar)
    if (valorFinal <= 0) return
    setPagamentos(anterior => [...anterior, { forma: novaFormaPagamento as FormaPagamento, valor: valorFinal }])
    setNovaFormaPagamento('')
    setNovoValorPagamento('')
  }

  const removerPagamento = (indice: number) => {
    setPagamentos(anterior => anterior.filter((_, i) => i !== indice))
    if (pagamentos[indice]?.forma !== 'dinheiro') return
    setPrecisaDeTroco(false)
    setValorPagoEmDinheiro('')
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
    reiniciarSessaoDigitacaoQuantidade()
    requestAnimationFrame(() => focarSelectProduto())
  }

  const handleKeyDownQuantidade = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (itemSelecionadoId) adicionarItemAoPedido()
      return
    }

    if (/^\d$/.test(e.key)) {
      e.preventDefault()
      const digitoDigitado = parseInt(e.key)

      if (!emSessaoDigitacaoQuantidadeRef.current) {
        setQuantidadeItemSelecionado(digitoDigitado)
        emSessaoDigitacaoQuantidadeRef.current = true
      } else {
        setQuantidadeItemSelecionado(anterior => {
          const novoValor = anterior * 10 + digitoDigitado
          return novoValor > 999 ? anterior : novoValor
        })
      }

      if (timerResetSessaoDigitacaoRef.current) clearTimeout(timerResetSessaoDigitacaoRef.current)
      timerResetSessaoDigitacaoRef.current = setTimeout(() => {
        emSessaoDigitacaoQuantidadeRef.current = false
      }, 1000)
    }
  }

  const removerItemDoPedido = (id: string) => {
    setItensDoPedido(anterior => anterior.filter(item => item.id !== id))
  }

  const adicionarItemPorCodigoDeBarras = useCallback((itemCatalogo: Item) => {
    setItensDoPedido(anterior => {
      const indiceExistente = anterior.findIndex(i => i.id === itemCatalogo.id)
      if (indiceExistente >= 0) {
        return anterior.map((item, index) => {
          if (index !== indiceExistente) return item
          const novaQuantidade = item.quantidade + 1
          return { ...item, quantidade: novaQuantidade, subtotal: item.preco * novaQuantidade }
        })
      }
      const novoItem: ItemPedido = {
        id: itemCatalogo.id,
        nome: itemCatalogo.nome,
        preco: itemCatalogo.preco,
        quantidade: 1,
        subtotal: itemCatalogo.preco,
      }
      return [...anterior, novoItem]
    })
  }, [])

  useEffect(() => {
    if (!aberto) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const buffer = barcodeBufferRef.current
        const stamps = barcodeStampsRef.current

        if (buffer.length >= COMPRIMENTO_MINIMO_CODIGO_DE_BARRAS && stamps.length > 1) {
          const todosCaracteresForamDigitadosRapido = stamps.every((stamp, i) =>
            i === 0 || stamp - stamps[i - 1] <= INTERVALO_MAXIMO_ENTRE_CARACTERES_DO_LEITOR_MS
          )

          if (todosCaracteresForamDigitadosRapido) {
            const itemEncontrado = itensCatalogo.find(i => i.codigo_barras === buffer)
            if (itemEncontrado) {
              adicionarItemPorCodigoDeBarras(itemEncontrado)
              e.preventDefault()
            }
          }
        }

        barcodeBufferRef.current = ''
        barcodeStampsRef.current = []
        return
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const agora = Date.now()
        barcodeBufferRef.current += e.key
        barcodeStampsRef.current.push(agora)

        if (barcodeTimerLimparRef.current) clearTimeout(barcodeTimerLimparRef.current)
        barcodeTimerLimparRef.current = setTimeout(() => {
          barcodeBufferRef.current = ''
          barcodeStampsRef.current = []
        }, 300)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (barcodeTimerLimparRef.current) clearTimeout(barcodeTimerLimparRef.current)
    }
  }, [aberto, itensCatalogo, adicionarItemPorCodigoDeBarras])

  const alterarQuantidadeItemNaTabela = (itemId: string, novaQuantidade: number) => {
    setItensDoPedido(anterior => anterior.map(item => {
      if (item.id !== itemId) return item
      const quantidade = Math.max(1, Math.min(999, novaQuantidade))
      return { ...item, quantidade, subtotal: item.preco * quantidade }
    }))
  }

  const reiniciarSessaoEdicaoQuantidadeTabela = () => {
    emSessaoEdicaoQuantidadeTabelaRef.current = false
    itemIdEmSessaoEdicaoTabelaRef.current = null
  }

  const handleKeyDownQuantidadeItemTabela = (e: React.KeyboardEvent, itemId: string) => {
    if (!/^\d$/.test(e.key)) return
    e.preventDefault()
    const digito = parseInt(e.key)
    const emSessaoDoMesmoItem = emSessaoEdicaoQuantidadeTabelaRef.current && itemIdEmSessaoEdicaoTabelaRef.current === itemId

    setItensDoPedido(anterior => anterior.map(item => {
      if (item.id !== itemId) return item
      const quantidade = emSessaoDoMesmoItem
        ? Math.min(999, item.quantidade * 10 + digito)
        : Math.max(1, digito)
      return { ...item, quantidade, subtotal: item.preco * quantidade }
    }))

    itemIdEmSessaoEdicaoTabelaRef.current = itemId
    emSessaoEdicaoQuantidadeTabelaRef.current = true

    if (timerSessaoEdicaoQuantidadeTabelaRef.current) clearTimeout(timerSessaoEdicaoQuantidadeTabelaRef.current)
    timerSessaoEdicaoQuantidadeTabelaRef.current = setTimeout(reiniciarSessaoEdicaoQuantidadeTabela, 1000)
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
      const primeiroPagamento = pagamentos[0] ?? null
      await onSalvar({
        ...dadosCliente,
        pagamentos,
        forma_pagamento: primeiroPagamento ? primeiroPagamento.forma : null,
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <BarcodeReaderIcon
                  fontSize="small"
                  color="action"
                  sx={{
                    '@keyframes piscar': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.2 },
                    },
                    animation: 'piscar 1.4s ease-in-out infinite',
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Aguardando leitura de código de barras...
                </Typography>
              </Box>
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
                  <Box ref={refContainerSelectProduto}>
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
                          if (id) {
                            reiniciarSessaoDigitacaoQuantidade()
                            requestAnimationFrame(() => refInputQuantidade.current?.focus())
                          }
                        }}
                      >
                        {itensCatalogo.map(item => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.nome} — R$ {item.preco.toFixed(2).replace('.', ',')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
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
                    inputRef={refInputQuantidade}
                    onKeyDown={handleKeyDownQuantidade}
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
                        <TableCell align="right" sx={{ py: 0.5 }}>
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{ min: 1 }}
                            value={item.quantidade}
                            onChange={(e) => {
                              alterarQuantidadeItemNaTabela(item.id, parseInt(e.target.value) || 1)
                              reiniciarSessaoEdicaoQuantidadeTabela()
                            }}
                            onKeyDown={(e) => handleKeyDownQuantidadeItemTabela(e, item.id)}
                            sx={{ width: '72px', '& .MuiInputBase-root': { borderRadius: '6px' } }}
                          />
                        </TableCell>
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

            {pagamentos.length > 0 && (
              <Grid size={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {pagamentos.map((pagamento, indice) => (
                    <Box
                      key={indice}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: '8px',
                        bgcolor: 'action.hover',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body2" sx={{ textTransform: 'capitalize', flex: 1 }}>
                        {pagamento.forma}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        R$ {pagamento.valor.toFixed(2).replace('.', ',')}
                      </Typography>
                      <IconButton size="small" color="error" onClick={() => removerPagamento(indice)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total pago: R$ {totalJaPago.toFixed(2).replace('.', ',')}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={valorRestanteAPagar > 0.001 ? 'warning.main' : 'success.main'}
                    >
                      {valorRestanteAPagar > 0.001
                        ? `Falta: R$ ${valorRestanteAPagar.toFixed(2).replace('.', ',')}`
                        : valorRestanteAPagar < -0.001
                          ? `Excedente: R$ ${Math.abs(valorRestanteAPagar).toFixed(2).replace('.', ',')}`
                          : 'Valor quitado ✓'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 5 }}>
              <FormControl fullWidth>
                <InputLabel>Forma de Pagamento</InputLabel>
                <Select
                  value={novaFormaPagamento}
                  label="Forma de Pagamento"
                  onChange={(e) => setNovaFormaPagamento(e.target.value as FormaPagamento | '')}
                >
                  <MenuItem value="">
                    <Typography variant="body2" color="text.secondary">Selecione...</Typography>
                  </MenuItem>
                  {todasFormasPagamento.map((forma) => (
                    <MenuItem key={forma} value={forma} sx={{ textTransform: 'capitalize' }}>
                      {forma}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Valor (R$)"
                type="number"
                inputProps={{ min: 0, step: '0.01' }}
                value={novoValorPagamento}
                placeholder={valorRestanteAPagar > 0 ? valorRestanteAPagar.toFixed(2) : '0,00'}
                onChange={(e) => setNovoValorPagamento(parseFloat(e.target.value) || '')}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={adicionarPagamento}
                disabled={!novaFormaPagamento}
                sx={{ height: '56px', borderRadius: '8px' }}
              >
                Adicionar
              </Button>
            </Grid>

            {temPagamentoDinheiro && (
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
                        label="Valor pago em dinheiro"
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
