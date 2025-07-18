import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeMode, ThemeState } from '@/types'

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme: ThemeMode) => {
        set({ theme })
        applyTheme(theme)
      },
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        applyTheme(newTheme)
      }
    }),
    {
      name: 'theme-storage'
    }
  )
)

// Apply theme to document
export function applyTheme(theme: ThemeMode) {
  const root = document.documentElement
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark')
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

// Initialize theme on client side
export function initializeTheme() {
  if (typeof window !== 'undefined') {
    const { theme } = useThemeStore.getState()
    applyTheme(theme)
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      const { theme } = useThemeStore.getState()
      if (theme === 'system') {
        applyTheme('system')
      }
    })
  }
} 