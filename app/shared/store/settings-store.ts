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
  return createStore<SettingsStore>()((set) => ({
    ...initState,
    setTheme: (theme) => {
      set((state) => ({
        theme: {
          ...state.theme,
          ...theme
        }
      }))
    }
  }))
}
