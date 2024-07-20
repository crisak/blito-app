import { persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

export type SettingsState = {
  theme: Theme
}

type Theme = {
  colorMode: 'light' | 'dark' | 'system'
}

export type SettingsActions = {
  setTheme: (theme: Partial<Theme>) => void
}

export type SettingsStore = SettingsState & SettingsActions

export const initSettingsStore = (): SettingsState => {
  return {
    theme: {
      colorMode: 'system'
    }
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
        }
      }),
      {
        name: 'settings-store'
      }
    )
  )
}
