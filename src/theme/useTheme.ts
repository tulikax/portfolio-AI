import { useContext } from 'react'
import { ThemeStateContext, type ThemeState } from './ThemeContext'

export function useTheme(): ThemeState {
  const state = useContext(ThemeStateContext)
  if (!state) throw new Error('useTheme must be used inside <ThemeProvider>')
  return state
}
