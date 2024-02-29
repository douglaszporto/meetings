import { ThemeProvider, createTheme } from '@mui/material/styles';

import Store from './contexts';
import Header from './components/Header';
import Calendar from './components/Calendar';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#EF6C00',
        },
        background: {
            default: '#222222',
            paper: '#222222',
        },
    },
  });

const App = () => {

	return <>
        <ThemeProvider theme={darkTheme}>
            <Store>
                <Header />
                <Calendar />
            </Store>
        </ThemeProvider>
    </>
}

export default App
