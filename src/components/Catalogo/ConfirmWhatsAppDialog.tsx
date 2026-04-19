'use client'

import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

const CHAVE_DADOS_CLIENTE = 'dados_cliente_miquinho'

type DadosCliente = {
  nome: string
  telefone: string
}

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: (dadosCliente: DadosCliente) => void
}

export default function ConfirmWhatsAppDialog({ open, onClose, onConfirm }: Props) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erroNome, setErroNome] = useState(false)
  const [erroTelefone, setErroTelefone] = useState(false)

  useEffect(() => {
    if (open) {
      try {
        const salvo = localStorage.getItem(CHAVE_DADOS_CLIENTE)
        if (salvo) {
          const dados: DadosCliente = JSON.parse(salvo)
          setNome(dados.nome ?? '')
          setTelefone(dados.telefone ?? '')
        }
      } catch {
      }
    }
  }, [open])

  const handleNomeChange = (valor: string) => {
    setNome(valor)
    setErroNome(false)
  }

  const handleTelefoneChange = (valor: string) => {
    setTelefone(valor)
    setErroTelefone(false)
  }

  const validarNomeClientePreenchido = () => nome.trim().length > 0
  const validarTelefoneClientePreenchido = () => telefone.trim().length > 0

  const handleConfirmar = () => {
    const nomeValido = validarNomeClientePreenchido()
    const telefoneValido = validarTelefoneClientePreenchido()
    setErroNome(!nomeValido)
    setErroTelefone(!telefoneValido)
    if (!nomeValido || !telefoneValido) return

    const dadosCliente: DadosCliente = { nome: nome.trim(), telefone: telefone.trim() }
    localStorage.setItem(CHAVE_DADOS_CLIENTE, JSON.stringify(dadosCliente))
    onConfirm(dadosCliente)
  }

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: { xs: '8px', sm: '16px' }, maxWidth: 420, width: '100%', margin: { xs: 1, sm: 3 } } }}>
      <DialogTitle fontWeight={700}>Finalizar Pedido</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Seu nome"
            value={nome}
            onChange={(e) => handleNomeChange(e.target.value)}
            error={erroNome}
            helperText={erroNome ? 'Informe seu nome' : ''}
            fullWidth
            autoFocus
          />
          <TextField
            label="Seu telefone"
            value={telefone}
            onChange={(e) => handleTelefoneChange(e.target.value)}
            error={erroTelefone}
            helperText={erroTelefone ? 'Informe seu telefone' : ''}
            fullWidth
            type="tel"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="success" startIcon={<WhatsAppIcon />} onClick={handleConfirmar} sx={{ borderRadius: '50px' }}>
          Ir para o WhatsApp
        </Button>
      </DialogActions>
    </Dialog>
  )
}
