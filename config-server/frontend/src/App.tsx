import ConfigurationPage from './pages/ConfigurationPage';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#24415f' },
    background: { default: '#f5f7fa', paper: '#ffffff' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Roboto, Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: '#dfe4ea' },
      },
    },
  },
});
  export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConfigurationPage />
    </ThemeProvider>
  );
}