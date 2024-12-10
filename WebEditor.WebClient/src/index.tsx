import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import React from 'react'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { StoreProvider } from './StoreContext.tsx';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4682B4',
        }
    }
});

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CssBaseline />
        <ThemeProvider theme={theme}>
            <StoreProvider>
                <App />
            </StoreProvider>
        </ThemeProvider>
    </React.StrictMode>
)
