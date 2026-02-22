import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { siteConfig } from '@/config/siteConfig'

export default function About() {
  return (
    <Box
      id="about"
      sx={{
        py: { xs: 8, md: 12 },
        background: siteConfig.colors.surface,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 8,
            alignItems: 'center',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="overline"
              sx={{
                color: siteConfig.colors.primary,
                fontWeight: 700,
                letterSpacing: '0.1em',
                display: 'block',
                mb: 1,
              }}
            >
              Quem Somos
            </Typography>

            <Typography
              variant="h2"
              sx={{
                color: siteConfig.colors.text,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.8rem' },
              }}
            >
              {siteConfig.about.title}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: siteConfig.colors.text,
                opacity: 0.8,
                lineHeight: 1.8,
                fontSize: '1.1rem',
                mb: 4,
              }}
            >
              {siteConfig.about.description}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Grid container spacing={3}>
              {siteConfig.about.stats.map((stat) => (
                <Grid size={6} key={stat.label}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${siteConfig.colors.primary}, #6B0099)`,
                      textAlign: 'center',
                      color: siteConfig.colors.textLight,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 32px rgba(74, 0, 128, 0.3)`,
                      },
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: siteConfig.colors.accent,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
