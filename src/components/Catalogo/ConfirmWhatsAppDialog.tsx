'use client'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmWhatsAppDialog({ open, onClose, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Você será direcionado ao WhatsApp</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 1 }}>
          Ao confirmar, você será redirecionado ao WhatsApp para concluir o pedido.
        </Typography>
        <Typography color="text.secondary">
          Observação: o carrinho será limpo ao confirmar. Se quiser salvar os itens, anote-os antes de prosseguir.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="success" startIcon={<WhatsAppIcon />} onClick={onConfirm}>
          Ir para o WhatsApp
        </Button>
      </DialogActions>
    </Dialog>
  )
}
