'use client'

import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Image from 'next/image'
import LogoutIcon from '@mui/icons-material/Logout'
import { useLogin } from '@/hooks/useLogin'
import { siteConfig } from '@/config/siteConfig'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { fazerLogout } = useLogin()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F9' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'rgba(74, 0, 128, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Image
              src={siteConfig.logo.url}
              alt={siteConfig.logo.alt}
              width={40}
              height={40}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <Typography color="white" fontWeight={700}>
              Admin — {siteConfig.company.name}
            </Typography>
          </Box>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={fazerLogout}
            sx={{ color: 'white' }}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ pt: 10, px: { xs: 2, md: 4 }, pb: 4, maxWidth: 1200, mx: 'auto' }}>
        {children}
      </Box>
    </Box>
  )
}
