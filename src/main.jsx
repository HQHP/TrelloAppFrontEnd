import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import { ConfirmProvider } from 'material-ui-confirm'
import 'react-toastify/dist/ReactToastify.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <ConfirmProvider defaultOptions={{
        buttonOrder:['confirm', 'cancel'],
        allowClose:false
      }}>
        <CssBaseline />
        <App />
        <ToastContainer theme="colored" position="bottom-left"/>
      </ConfirmProvider>
    </CssVarsProvider>
  </React.StrictMode>
)
