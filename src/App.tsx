// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react'
import { Provider } from 'react-redux'
import Router from '@routes/router'
import { store } from '@redux/store'
import { GlobalStyle } from '@styles/global-style'
import './styles/font.css'
import { AppThemeProvider } from '@redux/context/appThemeProvider'
import { AlertProvider } from '@redux/context/alertProvider'
import { BrowserRouter } from 'react-router-dom'
import AppView from '@components/AppView/AppView'
import { LoginProvider } from '@redux/context/loginProvider'
import { HelmetProvider } from 'react-helmet-async'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
  if (process.env.NODE_ENV === 'production') {
    console.log = function no_console() {}
    console.warn = function no_console() {}
  }
  return (
    <Provider store={store}>
      <HelmetProvider>
        <AppThemeProvider>
          <DndProvider backend={HTML5Backend}>
            <AlertProvider>
              <GlobalStyle />
              <BrowserRouter>
                <LoginProvider>
                  <AppView>
                    <Router />
                  </AppView>
                </LoginProvider>
              </BrowserRouter>
            </AlertProvider>
          </DndProvider>
        </AppThemeProvider>
      </HelmetProvider>
    </Provider>
  )
}

export default App
