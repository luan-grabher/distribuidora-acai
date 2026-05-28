"use client"

import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'

export function OperationalProof() {
  const images = siteConfig.proof?.images ?? []
  const captions = siteConfig.proof?.captions ?? []
  const metrics = siteConfig.proof?.metrics ?? []

  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  function openAt(i: number) {
    setIndex(i)
    setLoaded(false)
    setOpen(true)
  }

  function prev() {
    setLoaded(false)
    setIndex((i) => (i - 1 + images.length) % images.length)
  }

  function next() {
    setLoaded(false)
    setIndex((i) => (i + 1) % images.length)
  }

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, images.length])

  return (
    <Box id="prova-operacional" sx={{ py: { xs: 6, md: 10 }, background: siteConfig.colors.surface }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="overline" sx={{ color: siteConfig.colors.primary, fontWeight: 700, letterSpacing: '0.08em' }}>
            {siteConfig.proof?.overline}
          </Typography>

          <Typography variant="h3" sx={{ color: siteConfig.colors.text, mt: 1, mb: 1 }}>
            {siteConfig.proof?.title}
          </Typography>

          <Typography variant="body1" sx={{ color: siteConfig.colors.text, opacity: 0.8 }}>
            {siteConfig.proof?.subtitle}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {images.map((src, i) => (
            <Grid key={src} size={{ xs: 6, sm: 4, md: 3 }}>
              <Box onClick={() => openAt(i)} sx={{ cursor: 'pointer', position: 'relative', width: '100%', height: { xs: 140, sm: 160, md: 180 }, borderRadius: 1, overflow: 'hidden', border: `1px solid rgba(0,0,0,0.06)` }}>
                <Image src={src} alt={captions[i] ?? `Prova ${i + 1}`} fill sizes="(max-width:600px)50vw,33vw" loading="lazy" style={{ objectFit: 'cover' }} />
                {captions[i] && (
                  <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: '6px 8px', background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: '0.75rem' }}>
                    {captions[i]}
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {metrics.map((m, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: siteConfig.colors.primary, fontWeight: 800 }}>
                  {m.value}
                </Typography>
                <Typography variant="body2" sx={{ color: siteConfig.colors.text, opacity: 0.85 }}>
                  {m.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="outlined" href={siteConfig.nav.catalogoHref} sx={{ textTransform: 'none' }}>
            {siteConfig.hero.ctaSecondaryText ?? 'Ver catálogo'}
          </Button>
        </Box>
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
        <DialogContent sx={{ position: 'relative', p: 0, background: '#000' }}>
          <Box sx={{ position: 'relative', width: '100%', height: { xs: '60vh', md: '80vh' }, bgcolor: '#000' }}>
            {!loaded && <Skeleton variant="rectangular" sx={{ width: '100%', height: '100%' }} />}
            {images[index] && (
              <Image src={images[index]} alt={captions[index] ?? `Prova ${index + 1}`} fill sizes="100vw" onLoadingComplete={() => setLoaded(true)} style={{ objectFit: 'contain' }} />
            )}
          </Box>

          {captions[index] && (
            <Box sx={{ p: 2, background: '#000', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="body2" sx={{ color: '#fff', opacity: 0.92, textAlign: 'center' }}>
                {captions[index]}
              </Typography>
            </Box>
          )}

          <IconButton aria-label="previous" onClick={prev} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#fff' }}>
            ‹
          </IconButton>
          <IconButton aria-label="next" onClick={next} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#fff' }}>
            ›
          </IconButton>
          <IconButton aria-label="close" onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}>
            ✕
          </IconButton>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
