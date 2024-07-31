'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore, type StoreApi } from 'zustand'

import {
  SettingsStore,
  createSettingsStore,
  initSettingsStore
} from '@admin/shared/store/settings-store'

export const SettingsStoreContext =
  createContext<StoreApi<SettingsStore> | null>(null)

interface ProviderProps {
  children: ReactNode
}

export const SettingsStoreProvider = ({ children }: ProviderProps) => {
  const storeRef = useRef<StoreApi<SettingsStore>>()

  if (!storeRef.current) {
    storeRef.current = createSettingsStore(initSettingsStore())
  }

  return (
    <SettingsStoreContext.Provider value={storeRef.current}>
      {children}
    </SettingsStoreContext.Provider>
  )
}

export const useSettingsStore = <T,>(
  selector: (store: SettingsStore) => T
): T => {
  const SettStoreContext = useContext(SettingsStoreContext)

  if (!SettStoreContext) {
    throw new Error(`useSettingsStore must be use within SettingsStoreProvider`)
  }

  return useStore(SettStoreContext, selector)
}
