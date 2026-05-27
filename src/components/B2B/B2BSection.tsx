"use client"

import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { siteConfig } from '@/config/siteConfig'
import { ContactModal } from '@/components/ContactModal/ContactModal'

export function B2BSection() {
  const [openModal, setOpenModal] = useState(false)

  return (
    <Box
      id="atendemos"
      sx={{
        py: { xs: 6, md: 12 },
        background: siteConfig.colors.surface,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="overline" sx={{ color: siteConfig.colors.primary, fontWeight: 700 }}>
          {siteConfig.b2b.overline}
        </Typography>

        <Typography variant="h3" sx={{ mt: 1, mb: 2, fontWeight: 700 }}>
          {siteConfig.b2b.title}
        </Typography>

        <Typography sx={{ mb: 4, color: 'text.secondary', maxWidth: 720 }}>
          {siteConfig.b2b.subtitle}
        </Typography>

        <Grid container spacing={2}>
          {siteConfig.b2b.segments.map((s) => (
            <Grid item key={s.label} xs={6} sm={4} md={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  background: 'transparent',
                }}
              >
                <Box sx={{ fontSize: 32 }}>{s.emoji}</Box>
                <Typography sx={{ mt: 1, fontWeight: 600 }}>{s.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => setOpenModal(true)}
            sx={{
              background: `linear-gradient(135deg, ${siteConfig.colors.accent}, #E6B800)`,
              color: siteConfig.colors.text,
              fontWeight: 700,
              px: 4,
            }}
          >
            {siteConfig.b2b.ctaText}
          </Button>
        </Box>
      </Container>

      <ContactModal open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  )
}
