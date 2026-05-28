"use client"

import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'
import { ContactModal } from '@/components/ContactModal/ContactModal'

export default function Hero() {
  const [openModal, setOpenModal] = useState(false)

  const handleCTAClick = () => {
    setOpenModal(true)
  }

  const handleSecondaryClick = () => {
    const url = siteConfig.hero.catalogUrl || siteConfig.nav.catalogoHref
    if (typeof window !== 'undefined') window.open(url, '_blank')
  }

  const backgroundStyle = siteConfig.hero?.image
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.45), rgba(10,10,10,0.45)), url(${siteConfig.hero.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: `linear-gradient(135deg, ${siteConfig.colors.primary} 0%, #14001d 40%, #3D006B 70%, #1A0030 100%)` }

  return (
    <Box
      id="hero"
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: 8,
        ...backgroundStyle,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(249, 199, 21, 0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(46, 125, 50, 0.06) 0%, transparent 50%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 6,
            py: { xs: 8, md: 4 },
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h1"
              sx={{
                color: siteConfig.colors.textLight,
                fontSize: { xs: '2rem', md: '3rem', lg: '4rem' },
                lineHeight: 1.05,
                mb: 2,
                fontWeight: 700,
              }}
            >
              {siteConfig.hero.title}
              <br />
              <Box component="span" sx={{ color: siteConfig.colors.accent }}>
                {siteConfig.hero.titleHighlight}
              </Box>
            </Typography>

            <Typography
              variant="h5"
              component="div"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 400,
                mb: 5,
                lineHeight: 1.6,
                maxWidth: 560,
                mx: { xs: 'auto', md: 0 },
              }}
              dangerouslySetInnerHTML={{ __html: siteConfig.hero.subtitle }}
            />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleCTAClick}
                sx={{
                  background: `linear-gradient(135deg, ${siteConfig.colors.accent}, #E6B800)`,
                  color: siteConfig.colors.text,
                  fontWeight: 700,
                  px: 4,
                  '&:hover': {
                    background: `linear-gradient(135deg, #E6B800, ${siteConfig.colors.accent})`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px rgba(249, 199, 21, 0.4)`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {siteConfig.hero.ctaText}
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={handleSecondaryClick}
                sx={{
                  borderColor: 'rgba(255,255,255,0.8)',
                  color: siteConfig.colors.textLight,
                  px: 4,
                  '&:hover': {
                    borderColor: siteConfig.colors.textLight,
                    background: 'rgba(255,255,255,0.06)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {siteConfig.hero.ctaSecondaryText}
              </Button>

            </Box>
          </Box>

          <Box
            sx={{
              flex: { xs: 'none', md: '0 0 420px' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: { xs: 260, md: 420 },
                height: { xs: 260, md: 420 },
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(6px)',
                border: `2px solid rgba(255,255,255,0.08)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src={siteConfig.logo.url}
                alt={siteConfig.logo.alt}
                width={420}
                height={420}
                style={{ width: '110%', height: '110%', borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 45%' }}
              />
            </Box>
          </Box>
        </Box>
      </Container>

      <ContactModal open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  )
}
