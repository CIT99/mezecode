import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Helper function to apply theme class
const applyThemeClass = (theme) => {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark', // default to dark
      
      setTheme: (theme) => {
        set({ theme })
        applyThemeClass(theme)
      },
      
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark'
          applyThemeClass(newTheme)
          return { theme: newTheme }
        })
      },
      
      initializeTheme: () => {
        const state = useThemeStore.getState()
        applyThemeClass(state.theme)
      },
    }),
    {
      name: 'mezcode-theme',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Apply theme after rehydration
        if (state?.theme) {
          applyThemeClass(state.theme)
        }
      },
    }
  )
)

// Initialize theme immediately on module load (before React renders)
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('mezcode-theme')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (parsed.state?.theme) {
        applyThemeClass(parsed.state.theme)
      }
    } catch (e) {
      // If parsing fails, default to dark
      applyThemeClass('dark')
    }
  } else {
    // No stored theme, default to dark
    applyThemeClass('dark')
  }
}

