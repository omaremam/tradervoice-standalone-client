import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Outlet} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import {Container, Stack} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light'
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Stack height="100%">
        <Container component="main" maxWidth={false} sx={{flexGrow: 1}}>
          <Outlet/>
        </Container>
        <Footer/>
      </Stack>
    </ThemeProvider>
  );
}
