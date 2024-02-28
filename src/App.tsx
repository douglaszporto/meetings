import { ThemeProvider, createTheme } from '@mui/material/styles';

import Header from './components/Header';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#EF6C00',
        },
    },
  });

const App = () => {

	return <>
        <ThemeProvider theme={darkTheme}>
            <Header />
        </ThemeProvider>
    </>
}

export default App
