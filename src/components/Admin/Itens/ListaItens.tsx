'use client'

import { useState, useMemo } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FormularioItem from './FormularioItem'
import CabecalhoPagina from '../CabecalhoPagina'
import { useItensAdmin } from '@/hooks/useItensAdmin'
import type { Item, NovoItem, EdicaoItem } from '@/types/item'

export default function ListaItens() {
  const { itens, carregando, erro, criarItem, atualizarItem, excluirItem } = useItensAdmin()
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [itemEdicao, setItemEdicao] = useState<Item | null>(null)
  const [textoPesquisa, setTextoPesquisa] = useState('')

  const [idParaExcluir, setIdParaExcluir] = useState<string | null>(null)

  const itensFiltrados = useMemo(() => {
    const termoBuscaNormalizado = textoPesquisa.trim().toLowerCase()
    if (!termoBuscaNormalizado) return itens
    return itens.filter(
      (item) =>
        item.nome.toLowerCase().includes(termoBuscaNormalizado) ||
        item.descricao.toLowerCase().includes(termoBuscaNormalizado),
    )
  }, [itens, textoPesquisa])

  const confirmarExclusao = (id: string) => setIdParaExcluir(id)

  const handleExcluir = async () => {
    if (!idParaExcluir) return
    await excluirItem(idParaExcluir)
    setIdParaExcluir(null)
  }

  const abrirNovoItem = () => {
    setItemEdicao(null)
    setFormularioAberto(true)
  }

  const abrirEdicao = (item: Item) => {
    setItemEdicao(item)
    setFormularioAberto(true)
  }

  const handleSalvar = async (dados: NovoItem | EdicaoItem) => {
    if (itemEdicao) {
      await atualizarItem(itemEdicao.id, dados)
    } else {
      await criarItem(dados as NovoItem)
    }
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
        titulo="Itens do Catálogo"
        labelBotao="Novo Item"
        onClicarBotao={abrirNovoItem}
      />

      {erro && <Alert severity="error">{erro}</Alert>}

      <TextField
        placeholder="Pesquisar por nome ou descrição..."
        value={textoPesquisa}
        onChange={(e) => setTextoPesquisa(e.target.value)}
        size="small"
        sx={{ maxWidth: 400 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'background.paper' } }}>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Estoque</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itensFiltrados.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={item.imagem_url}
                      alt={item.nome}
                      sx={{ width: 48, height: 48 }}
                      variant="rounded"
                    />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>{item.nome}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.descricao}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {item.promocao_ativa != null ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', lineHeight: 1 }}>
                        R$ {item.preco.toFixed(2).replace('.', ',')}
                      </Typography>
                      <Typography fontWeight={600} color="error">
                        R$ {item.promocao_ativa.toFixed(2).replace('.', ',')}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography fontWeight={600} color="primary">
                      R$ {item.preco.toFixed(2).replace('.', ',')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{item.estoque}</TableCell>
                <TableCell>
                  <Chip
                    label={item.ativo ? 'Ativo' : 'Inativo'}
                    color={item.ativo ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => abrirEdicao(item)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => confirmarExclusao(item.id)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {itensFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {textoPesquisa.trim() ? 'Nenhum item encontrado para a pesquisa' : 'Nenhum item cadastrado'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <FormularioItem
        aberto={formularioAberto}
        onFechar={() => setFormularioAberto(false)}
        itemEdicao={itemEdicao}
        onSalvar={handleSalvar}
      />

      <Dialog open={idParaExcluir !== null} onClose={() => setIdParaExcluir(null)} PaperProps={{ sx: { borderRadius: { xs: '8px', sm: '16px' }, margin: { xs: 1, sm: 3 }, width: '100%' } }}>
        <DialogTitle fontWeight={700}>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIdParaExcluir(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleExcluir} sx={{ borderRadius: '50px' }}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
