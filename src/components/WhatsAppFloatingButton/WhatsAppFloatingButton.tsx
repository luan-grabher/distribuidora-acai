'use client'

import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { siteConfig } from '@/config/siteConfig'

export default function WhatsAppFloatingButton() {
  const whatsappNumber = siteConfig.company.whatsapp.replace(/\D/g, '')

  return (
    <Tooltip title="Falar no WhatsApp" placement="left">
      <Fab
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          background: '#25D366',
          color: '#FFFFFF',
          '&:hover': {
            background: '#1EAD52',
            transform: 'scale(1.1)',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.5)',
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 30 }} />
      </Fab>
    </Tooltip>
  )
}
