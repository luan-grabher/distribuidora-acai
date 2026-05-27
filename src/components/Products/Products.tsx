"use client"

import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'

export default function Products() {
  const [selected, setSelected] = useState('all')

  function ProductImage({ src, alt }: { src: string; alt?: string }) {
    const [loaded, setLoaded] = useState(false)

    return (
      <Box sx={{ width: { xs: 40, sm: 48, md: 56 }, height: { xs: 40, sm: 48, md: 56 }, mb: 0.8, position: 'relative' }}>
        {!loaded && <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 1 }} />}
        <Image
          src={src}
          alt={alt ?? ''}
          fill
          sizes="72px"
          loading="lazy"
          onLoadingComplete={() => setLoaded(true)}
          style={{ objectFit: 'cover', borderRadius: 6, opacity: loaded ? 1 : 0, transition: 'opacity 200ms ease-in' }}
        />
      </Box>
    )
  }

  const categoryMap = new Map<string, string>()
  siteConfig.products.items.forEach((item) => {
    const key = item.category ?? 'other'
    if (!categoryMap.has(key)) categoryMap.set(key, item.categoryLabel ?? item.category ?? item.name)
  })

  const categories = [{ key: 'all', label: 'Todos' }, ...Array.from(categoryMap.entries()).map(([key, label]) => ({ key, label }))]

  const visible = selected === 'all' ? siteConfig.products.items : siteConfig.products.items.filter((p) => (p.category ?? 'other') === selected)

  return (
    <Box id="products" sx={{ py: { xs: 8, md: 12 }, background: siteConfig.colors.background }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="overline" sx={{ color: siteConfig.colors.primary, fontWeight: 700, letterSpacing: '0.1em', display: 'block', mb: 1 }}>
            {siteConfig.products.overline}
          </Typography>

          <Typography variant="h2" sx={{ color: siteConfig.colors.text, mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            {siteConfig.products.title}
          </Typography>

          <Typography variant="h6" sx={{ color: siteConfig.colors.text, opacity: 0.6, fontWeight: 400 }}>
            {siteConfig.products.subtitle}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              clickable
              color={selected === c.key ? 'primary' : 'default'}
              onClick={() => setSelected(c.key)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
          ))}
        </Stack>

        <Grid container spacing={2}>
          {visible.map((product) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={product.name} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                elevation={0}
                sx={{
                  width: '100%',
                  maxWidth: { xs: 140, sm: 160, md: 180, lg: 200 },
                  height: { xs: 140, sm: 160, md: 180, lg: 200 },
                  border: `1px solid rgba(74, 0, 128, 0.08)`,
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px rgba(74, 0, 128, 0.10)`,
                    borderColor: siteConfig.colors.primary,
                  },
                  transition: 'all 0.2s ease',
                  background: siteConfig.colors.surface,
                }}
              >
                <CardContent sx={{ p: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  {product.image ? (
                    <ProductImage src={product.image} alt={product.name} />
                  ) : (
                    <Box sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' }, mb: 0.8, textAlign: 'center' }}>{product.emoji}</Box>
                  )}
                  <Typography variant="subtitle2" sx={{ color: siteConfig.colors.text, mb: 0.5, fontWeight: 700, textAlign: 'center' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: siteConfig.colors.text, opacity: 0.85, lineHeight: 1.3, textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button component="a" href={siteConfig.nav.catalogoHref} variant="outlined" sx={{ textTransform: 'none' }}>
            Veja nosso catálogo completo
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
