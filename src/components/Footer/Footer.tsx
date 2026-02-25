import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        background: siteConfig.colors.text,
        color: 'rgba(255,255,255,0.7)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Image
              src={siteConfig.logo.url}
              alt={siteConfig.logo.alt}
              width={40}
              height={40}
              style={{ borderRadius: '50%', objectFit: 'cover', opacity: 0.9 }}
            />
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
              {siteConfig.company.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              {siteConfig.footer.copyright}
            </Typography>
            <Link
              href="/admin"
              sx={{
                color: 'rgba(255,255,255,0.3)',
                textDecoration: 'none',
                fontSize: '0.75rem',
                '&:hover': { color: 'rgba(255,255,255,0.6)' },
                transition: 'all 0.3s ease',
              }}
            >
              Área Administrativa
            </Link>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            {siteConfig.footer.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                sx={{
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  '&:hover': { color: siteConfig.colors.textLight },
                  transition: 'all 0.3s ease',
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
