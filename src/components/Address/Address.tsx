import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
// usando Box flexível para layout responsivo
import Chip from '@mui/material/Chip'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { siteConfig } from '@/config/siteConfig'

export default function Address() {
  const { street, neighborhood, city, state, cep, googleMapsEmbedUrl, overline, title, citiesAttended = [], featuredCities = [] } = siteConfig.address

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

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'stretch' }}>
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 8px 32px rgba(74, 0, 128, 0.15)', width: '100%', height: { xs: 300, md: 450 } }}>
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Miquinho Distribuidora"
              />
            </Box>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: siteConfig.colors.text, fontWeight: 700, mb: 1 }}>
                Cidades atendidas
              </Typography>

              <Typography variant="body2" sx={{ color: siteConfig.colors.text, opacity: 0.8 }}>
                Atendemos várias nas cidades de Porto Alegre, Alvorada e Viamão.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 1.25, mt: 2 }}>
                {citiesAttended.map((c) => {
                  const highlighted = featuredCities.includes(c)
                  return (
                    <Chip
                      key={c}
                      label={c}
                      color={highlighted ? 'primary' : 'default'}
                      variant={highlighted ? 'filled' : 'outlined'}
                      sx={{ fontWeight: highlighted ? 700 : 600 }}
                    />
                  )
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
