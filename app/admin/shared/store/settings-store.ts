import { persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

export type SettingsState = {
  theme: Theme
  showNavigation: boolean
}

type Theme = {
  colorMode: 'light' | 'dark' | 'system'
}

export type SettingsActions = {
  setTheme: (theme: Partial<Theme>) => void
  toggleNavigation: () => void
}

export type SettingsStore = SettingsState & SettingsActions

export const initSettingsStore = (): SettingsState => {
  return {
    theme: {
      colorMode: 'system'
    },
    showNavigation: true
  }
}

export const createSettingsStore = (
  initState: SettingsState = initSettingsStore()
) => {
  return createStore<SettingsStore>()(
    persist(
      (set) => ({
        ...initState,
        setTheme: (theme) => {
          set((state) => ({
            theme: {
              ...state.theme,
              ...theme
            }
          }))
        },
        toggleNavigation: () => {
          set((state) => ({
            showNavigation: !state.showNavigation
          }))
        }
      }),
      {
        name: 'settings-store'
      }
    )
  )
}
