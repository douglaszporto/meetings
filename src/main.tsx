import React from 'react'
import ReactDOM from 'react-dom/client'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'

import App from './App.tsx'
import dayjs from "dayjs";
import locale from 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat'

import './index.css'

dayjs.locale(locale);
dayjs.extend(localizedFormat);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <App />
        </LocalizationProvider>
    </React.StrictMode>,
)
