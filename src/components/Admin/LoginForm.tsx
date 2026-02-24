'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Image from 'next/image'
import { useLogin } from '@/hooks/useLogin'
import { siteConfig } from '@/config/siteConfig'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const { fazerLogin, carregando, erro } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fazerLogin(email, senha)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4A0080 0%, #7B1FA2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Image
              src={siteConfig.logo.url}
              alt={siteConfig.logo.alt}
              width={80}
              height={80}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <Typography variant="h5" fontWeight={700} sx={{ mt: 2 }}>
              Admin
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {siteConfig.company.name}
            </Typography>
          </Box>

          {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={carregando}
              sx={{ borderRadius: '50px', py: 1.5 }}
            >
              {carregando ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
