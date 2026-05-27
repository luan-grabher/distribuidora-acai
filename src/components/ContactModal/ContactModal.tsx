'use client'

import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { siteConfig } from '@/config/siteConfig'
import { gerarUrlWhatsapp } from '@/lib/whatsapp/gerarPedido'

type ContactModalProps = {
  open: boolean
  onClose: () => void
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [nome, setNome] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cidade, setCidade] = useState('')

  const isValid = nome.trim() !== '' && telefone.trim() !== ''

  const handleSubmit = () => {
    const mensagem = `Olá, sou *${nome.trim()}*${empresa ? ` da empresa *${empresa.trim()}*` : ''} e tenho interesse em revender seus produtos.\nTelefone: ${telefone.trim()}\nCidade: ${cidade.trim()}`
    const url = gerarUrlWhatsapp(siteConfig.company.whatsapp, mensagem)
    window.open(url, '_blank')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Quero revender</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth required />
          <TextField label="Empresa (opcional)" value={empresa} onChange={(e) => setEmpresa(e.target.value)} fullWidth />
          <TextField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} fullWidth required placeholder="(51) 99999-9999" />
          <TextField label="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} fullWidth />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Ao enviar, abriremos o WhatsApp com a sua mensagem pronta.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isValid}>
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
