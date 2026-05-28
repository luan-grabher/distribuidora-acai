import { createTheme } from '@mui/material/styles'
import { siteConfig } from '@/config/siteConfig'

const { colors } = siteConfig

export const theme = createTheme({
  palette: {
    mode: 'light',
    contrastThreshold: 3,
    tonalOffset: 0.1,
    primary: {
      main: colors.primary,
      contrastText: colors.textLight,
    },
    secondary: {
      main: colors.secondary,
      contrastText: colors.textLight,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.text,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
          padding: '10px 24px',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          transition: 'all 0.3s ease',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
})
