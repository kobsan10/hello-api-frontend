import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1565c0' },
    background: { default: '#f4f6f8' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
  },
})

export default theme
