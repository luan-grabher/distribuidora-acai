import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { siteConfig } from '@/config/siteConfig'

export default function Address() {
  const { street, neighborhood, city, state, cep, googleMapsEmbedUrl, overline, title } = siteConfig.address

  return (
    <Box
      id="address"
      sx={{
        py: { xs: 8, md: 12 },
        background: siteConfig.colors.surface,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="overline"
          sx={{
            color: siteConfig.colors.primary,
            fontWeight: 700,
            letterSpacing: '0.1em',
            display: 'block',
            mb: 1,
            textAlign: 'center',
          }}
        >
          {overline}
        </Typography>

        <Typography
          variant="h2"
          sx={{
            color: siteConfig.colors.text,
            mb: 2,
            fontSize: { xs: '2rem', md: '2.8rem' },
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 6,
          }}
        >
          <LocationOnIcon sx={{ color: siteConfig.colors.primary, fontSize: 22 }} />
          <Typography
            variant="body1"
            sx={{
              color: siteConfig.colors.text,
              opacity: 0.8,
              fontSize: '1.05rem',
            }}
          >
            {street}, {neighborhood} — {city}/{state}, CEP {cep}
          </Typography>
        </Box>

        <Box
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(74, 0, 128, 0.15)',
            width: '100%',
            height: { xs: 300, md: 450 },
          }}
        >
          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização Miquinho Distribuidora"
          />
        </Box>
      </Container>
    </Box>
  )
}
