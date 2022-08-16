import { darkTheme, lightTheme } from '@styles/theme'
import { createContext, useCallback, useContext, useState } from 'react'
import { ThemeProvider } from 'styled-components'

type UseThemeReturnTypes = [string, () => void]

interface AppThemeProviderProps {
  children: React.ReactNode
}

interface IAppThemeContext {
  ThemeMode: string
  setThemeMode?: React.Dispatch<React.SetStateAction<string>>
}

const AppThemeContext = createContext<IAppThemeContext>({ ThemeMode: 'dark' })

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const localSettingTheme = window.localStorage.getItem('theme') || 'dark'
  const [ThemeMode, setThemeMode] = useState(localSettingTheme)
  const themeObject = ThemeMode === 'dark' ? darkTheme : lightTheme

  return (
    <AppThemeContext.Provider value={{ ThemeMode, setThemeMode }}>
      <ThemeProvider theme={themeObject}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  )
}

export const useAppTheme = (): UseThemeReturnTypes => {
  const context = useContext(AppThemeContext)
  const { ThemeMode, setThemeMode } = context

  const toggleTheme = useCallback(() => {
    if (!setThemeMode) return
    if (ThemeMode === 'light') {
      setThemeMode('dark')
      window.localStorage.setItem('theme', 'dark')
    } else {
      setThemeMode('light')
      window.localStorage.setItem('theme', 'light')
    }
  }, [ThemeMode, setThemeMode])

  return [ThemeMode, toggleTheme]
}
