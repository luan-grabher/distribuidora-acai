"use client"
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import VerifiedIcon from '@mui/icons-material/Verified'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import InventoryIcon from '@mui/icons-material/Inventory'
import SupportIcon from '@mui/icons-material/Support'
import Button from '@mui/material/Button'
import { ElementType } from 'react'
import { siteConfig } from '@/config/siteConfig'
import { ContactModal } from '@/components/ContactModal/ContactModal'

const iconMap: Record<string, ElementType> = {
  Agriculture: AgricultureIcon,
  Verified: VerifiedIcon,
  LocalShipping: LocalShippingIcon,
  AttachMoney: AttachMoneyIcon,
  Inventory: InventoryIcon,
  Support: SupportIcon,
}

export default function Benefits() {
  const [open, setOpen] = useState(false)

  return (
    <Box id="benefits" sx={{ py: { xs: 8, md: 12 }, background: siteConfig.colors.surface }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="overline" sx={{ color: siteConfig.colors.primary, fontWeight: 700, letterSpacing: '0.1em', display: 'block', mb: 1 }}>
            {siteConfig.benefits.overline}
          </Typography>

          <Typography variant="h2" sx={{ color: siteConfig.colors.text, mb: 1, fontSize: { xs: '1.6rem', md: '2.4rem' } }}>
            {siteConfig.benefits.title}
          </Typography>

          <Typography variant="body1" sx={{ color: siteConfig.colors.text, opacity: 0.75 }}>
            {siteConfig.benefits.subtitle}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {siteConfig.benefits.items.map((benefit) => {
            const IconComponent = iconMap[benefit.icon]
            return (
              <Grid key={benefit.title} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                <Box sx={{ p: 3, borderRadius: 3, background: siteConfig.colors.background, border: `1px solid rgba(74, 0, 128, 0.06)`, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 24px rgba(74, 0, 128, 0.08)`, borderColor: `rgba(74, 0, 128, 0.12)` }, transition: 'all 0.25s ease' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 2, background: `linear-gradient(135deg, ${siteConfig.colors.primary}, #6B0099)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {IconComponent && <IconComponent sx={{ color: siteConfig.colors.textLight, fontSize: 26 }} />}
                      </Box>

                      {benefit.stat && (
                        <Typography variant="h4" sx={{ color: siteConfig.colors.primary, fontWeight: 800 }}>
                          {benefit.stat}
                        </Typography>
                      )}
                    </Box>

                    <Typography variant="h6" sx={{ color: siteConfig.colors.text, mb: 1, fontWeight: 700 }}>
                      {benefit.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: siteConfig.colors.text, opacity: 0.75, lineHeight: 1.6 }}>
                      {benefit.description}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="text" onClick={() => setOpen(true)} sx={{ textTransform: 'none' }}>
                      Falar com comercial
                    </Button>
                  </Box>
                </Box>
              </Grid>
            )
          })}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" onClick={() => setOpen(true)} sx={{ textTransform: 'none' }}>
            Quero garantir preços exclusivos
          </Button>
        </Box>

        <ContactModal open={open} onClose={() => setOpen(false)} />
      </Container>
    </Box>
  )
}
