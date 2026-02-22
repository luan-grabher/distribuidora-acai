import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { siteConfig } from '@/config/siteConfig'

export default function Products() {
  return (
    <Box
      id="products"
      sx={{ py: { xs: 8, md: 12 }, background: siteConfig.colors.background }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
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
            Cardápio
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: siteConfig.colors.text,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.8rem' },
            }}
          >
            {siteConfig.products.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: siteConfig.colors.text, opacity: 0.6, fontWeight: 400 }}
          >
            {siteConfig.products.subtitle}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {siteConfig.products.items.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.name}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: `1px solid rgba(74, 0, 128, 0.1)`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 48px rgba(74, 0, 128, 0.15)`,
                    borderColor: siteConfig.colors.primary,
                  },
                  transition: 'all 0.3s ease',
                  background: siteConfig.colors.surface,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ fontSize: '3rem', mb: 2 }}>{product.emoji}</Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: siteConfig.colors.text,
                      mb: 1.5,
                      fontWeight: 700,
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: siteConfig.colors.text,
                      opacity: 0.7,
                      lineHeight: 1.7,
                    }}
                  >
                    {product.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
