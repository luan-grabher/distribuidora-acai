'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import InstagramIcon from '@mui/icons-material/Instagram'
import { siteConfig } from '@/config/siteConfig'

export default function Contact() {
  const whatsappNumber = siteConfig.company.whatsapp.replace(/\D/g, '')

  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${siteConfig.colors.primary} 0%, #3D006B 100%)`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(249, 199, 21, 0.06) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(46, 125, 50, 0.08) 0%, transparent 60%)',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            color: siteConfig.colors.textLight,
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          {siteConfig.contact.title}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.75)',
            mb: 6,
            fontWeight: 400,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.7,
          }}
        >
          {siteConfig.contact.subtitle}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<WhatsAppIcon />}
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              background: '#25D366',
              color: siteConfig.colors.textLight,
              px: 4,
              '&:hover': {
                background: '#1EAD52',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {siteConfig.contact.whatsappText}
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<EmailIcon />}
            href={`mailto:${siteConfig.company.email}`}
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: siteConfig.colors.textLight,
              px: 4,
              '&:hover': {
                borderColor: siteConfig.colors.textLight,
                background: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {siteConfig.contact.emailText}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <InstagramIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 20 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            {siteConfig.company.instagram}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
