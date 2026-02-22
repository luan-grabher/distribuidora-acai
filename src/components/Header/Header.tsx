'use client'

import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setDrawerOpen(false)
    const element = document.querySelector(href)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled
            ? 'rgba(74, 0, 128, 0.95)'
            : 'rgba(74, 0, 128, 0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Image
              src={siteConfig.logo.url}
              alt={siteConfig.logo.alt}
              width={50}
              height={50}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <Box
              component="span"
              sx={{
                color: siteConfig.colors.textLight,
                fontWeight: 700,
                fontSize: { xs: '1rem', md: '1.2rem' },
                letterSpacing: '-0.01em',
              }}
            >
              {siteConfig.company.name}
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {siteConfig.nav.links.map((link) => (
              <Button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                sx={{
                  color: siteConfig.colors.textLight,
                  fontWeight: 500,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.15)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          <IconButton
            sx={{ display: { md: 'none' }, color: siteConfig.colors.textLight }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: siteConfig.colors.primary,
            color: siteConfig.colors.textLight,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ color: siteConfig.colors.textLight }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {siteConfig.nav.links.map((link) => (
            <ListItem key={link.href} disablePadding>
              <ListItemButton onClick={() => handleNavClick(link.href)}>
                <ListItemText
                  primary={link.label}
                  sx={{ color: siteConfig.colors.textLight }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}
