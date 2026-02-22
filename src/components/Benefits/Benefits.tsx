import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import VerifiedIcon from '@mui/icons-material/Verified'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import InventoryIcon from '@mui/icons-material/Inventory'
import SupportIcon from '@mui/icons-material/Support'
import { ElementType } from 'react'
import { siteConfig } from '@/config/siteConfig'

const iconMap: Record<string, ElementType> = {
  Agriculture: AgricultureIcon,
  Verified: VerifiedIcon,
  LocalShipping: LocalShippingIcon,
  AttachMoney: AttachMoneyIcon,
  Inventory: InventoryIcon,
  Support: SupportIcon,
}

export default function Benefits() {
  return (
    <Box
      id="benefits"
      sx={{ py: { xs: 8, md: 12 }, background: siteConfig.colors.surface }}
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
            Diferenciais
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: siteConfig.colors.text,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.8rem' },
            }}
          >
            {siteConfig.benefits.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: siteConfig.colors.text, opacity: 0.6, fontWeight: 400 }}
          >
            {siteConfig.benefits.subtitle}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {siteConfig.benefits.items.map((benefit) => {
            const IconComponent = iconMap[benefit.icon]
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={benefit.title}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: siteConfig.colors.background,
                    border: `1px solid rgba(74, 0, 128, 0.08)`,
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 16px 40px rgba(74, 0, 128, 0.12)`,
                      borderColor: `rgba(74, 0, 128, 0.2)`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${siteConfig.colors.primary}, #6B0099)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    {IconComponent && (
                      <IconComponent sx={{ color: siteConfig.colors.textLight, fontSize: 28 }} />
                    )}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{ color: siteConfig.colors.text, mb: 1.5, fontWeight: 700 }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: siteConfig.colors.text, opacity: 0.7, lineHeight: 1.7 }}
                  >
                    {benefit.description}
                  </Typography>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}
