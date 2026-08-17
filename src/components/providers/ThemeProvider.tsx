import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'green' | 'system'
type ResolvedTheme = 'light' | 'dark' | 'green'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: ResolvedTheme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

const resolveTheme = (theme: Theme, systemPrefersDark: boolean): ResolvedTheme => {
  if (theme === 'system') return systemPrefersDark ? 'dark' : 'light'
  return theme
}

export const ThemeProvider = ({ children, defaultTheme = 'green' }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || defaultTheme
    }
    return defaultTheme
  })

  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false,
  )

  const resolvedTheme = resolveTheme(theme, systemPrefersDark)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark', 'green')
    root.classList.add(resolvedTheme)
    localStorage.setItem('theme', theme)
  }, [theme, resolvedTheme])

  // Keep resolvedTheme in sync with the OS setting while theme === 'system'.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
