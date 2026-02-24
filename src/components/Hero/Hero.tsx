'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Image from 'next/image'
import Link from 'next/link'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { siteConfig } from '@/config/siteConfig'

export default function Hero() {
  const handleCTAClick = () => {
    const element = document.querySelector('#contact')
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSecondaryClick = () => {
    const element = document.querySelector('#products')
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box
      id="hero"
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${siteConfig.colors.primary} 0%, #6B0099 40%, #3D006B 70%, #1A0030 100%)`,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: 8,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(249, 199, 21, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(46, 125, 50, 0.1) 0%, transparent 50%)',
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
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                lineHeight: 1.1,
                mb: 2,
              }}
            >
              {siteConfig.hero.title}
              <br />
              <Box
                component="span"
                sx={{ color: siteConfig.colors.accent }}
              >
                {siteConfig.hero.titleHighlight}
              </Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 400,
                mb: 5,
                lineHeight: 1.6,
                maxWidth: 520,
                mx: { xs: 'auto', md: 0 },
              }}
            >
              {siteConfig.hero.subtitle}
            </Typography>

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
                {siteConfig.hero.ctaSecondaryText}
              </Button>

              <Button
                component={Link}
                href={siteConfig.nav.catalogoHref}
                variant="contained"
                size="large"
                startIcon={<MenuBookIcon />}
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  color: siteConfig.colors.textLight,
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  px: 4,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.25)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Ver Cardápio
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              flex: { xs: 'none', md: '0 0 520px' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: { xs: 300, md: 460 },
                height: { xs: 300, md: 460 },
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: `3px solid rgba(249, 199, 21, 0.4)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 80px rgba(249, 199, 21, 0.2), 0 0 40px rgba(74, 0, 128, 0.4)`,
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
    </Box>
  )
}
