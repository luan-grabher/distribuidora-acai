'use client'

import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Image from 'next/image'
import Link from 'next/link'
import LogoutIcon from '@mui/icons-material/Logout'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import HomeIcon from '@mui/icons-material/Home'
import InventoryIcon from '@mui/icons-material/Inventory'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { useLogin } from '@/hooks/useLogin'
import { siteConfig } from '@/config/siteConfig'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const paginasAdmin = [
  { label: 'Início', href: '/admin/dashboard', exato: true, icon: <HomeIcon /> },
  { label: 'Itens do Catálogo', href: '/admin/dashboard/itens', exato: false, icon: <InventoryIcon /> },
  { label: 'Pedidos', href: '/admin/dashboard/pedidos', exato: false, icon: <ShoppingBagIcon /> },
  { label: 'Financeiro', href: '/admin/dashboard/financeiro', exato: false, icon: <AttachMoneyIcon /> },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { fazerLogout } = useLogin()
  const pathname = usePathname()
  const router = useRouter()
  const [estaEmTelaCheia, setEstaEmTelaCheia] = useState(false)

  useEffect(() => {
    const atualizarEstadoTelaCheia = () => setEstaEmTelaCheia(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', atualizarEstadoTelaCheia)
    return () => document.removeEventListener('fullscreenchange', atualizarEstadoTelaCheia)
  }, [])

  const alternarTelaCheia = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  const abaAtiva = paginasAdmin.findIndex((pagina) =>
    pagina.exato ? pathname === pagina.href : pathname.startsWith(pagina.href)
  )

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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', cursor: 'pointer' }}>
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
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={alternarTelaCheia} sx={{ color: 'white' }} aria-label={estaEmTelaCheia ? 'Sair de tela cheia' : 'Ativar tela cheia'}>
              {estaEmTelaCheia ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={fazerLogout}
              sx={{ color: 'white' }}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
        <Tabs
          value={abaAtiva === -1 ? 0 : abaAtiva}
          onChange={(_, novoIndice) => router.push(paginasAdmin[novoIndice].href)}
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { backgroundColor: '#F9C715' } }}
          sx={{ px: 2 }}
        >
          {paginasAdmin.map((pagina) => (
            <Tab
              key={pagina.href}
              label={pagina.label}
              icon={pagina.icon}
              iconPosition="start"
              sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: 'white' }, minHeight: 48 }}
            />
          ))}
        </Tabs>
      </AppBar>
      <Box sx={{ pt: 14, px: { xs: 2, md: 4 }, pb: 4, maxWidth: 1200, mx: 'auto' }}>
        {children}
      </Box>
    </Box>
  )
}
