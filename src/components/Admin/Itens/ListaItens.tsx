'use client'

import { useState } from 'react'
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
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import FormularioItem from './FormularioItem'
import { useItensAdmin } from '@/hooks/useItensAdmin'
import type { Item, NovoItem, EdicaoItem } from '@/types/item'

export default function ListaItens() {
  const { itens, carregando, erro, criarItem, atualizarItem, excluirItem } = useItensAdmin()
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [itemEdicao, setItemEdicao] = useState<Item | null>(null)

  const [idParaExcluir, setIdParaExcluir] = useState<string | null>(null)

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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Itens do Catálogo
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={abrirNovoItem}
          sx={{ borderRadius: '50px' }}
        >
          Novo Item
        </Button>
      </Box>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

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
            {itens.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>{item.nome}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.descricao}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} color="primary">
                    R$ {item.preco.toFixed(2).replace('.', ',')}
                  </Typography>
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
            {itens.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">Nenhum item cadastrado</Typography>
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

      <Dialog open={idParaExcluir !== null} onClose={() => setIdParaExcluir(null)} PaperProps={{ sx: { borderRadius: '16px' } }}>
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
