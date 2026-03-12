import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Header from '@/components/Header/Header'

function SkeletonItemCatalogo() {
  return (
    <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(74,0,128,0.1)' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ p: 2 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 0.5 }} width="60%" />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="80%" />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" sx={{ fontSize: '1.75rem' }} width="45%" />
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Skeleton variant="rounded" height={48} sx={{ borderRadius: '50px' }} />
      </Box>
    </Card>
  )
}

export default function CarregandoCatalogo() {
  return (
    <Box sx={{ minHeight: '90vh', bgcolor: 'background.default' }}>
      <Header />

      <Box
        sx={{
          background: 'linear-gradient(135deg, #4A0080 0%, #7B1FA2 100%)',
          pt: { xs: 15, md: 20 },
          pb: { xs: 8, md: 10 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Skeleton
          variant="text"
          sx={{ fontSize: { xs: '2rem', md: '3rem' }, mx: 'auto', mb: 1, bgcolor: 'rgba(255,255,255,0.15)' }}
          width={200}
        />
        <Skeleton
          variant="text"
          sx={{ fontSize: '1.25rem', mx: 'auto', bgcolor: 'rgba(255,255,255,0.10)' }}
          width={320}
        />
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 } }}>
        <Skeleton variant="rounded" height={56} sx={{ mb: 4, maxWidth: 480, borderRadius: '50px' }} />
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <SkeletonItemCatalogo />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
