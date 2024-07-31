'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore, type StoreApi } from 'zustand'

import {
  CategoryStore,
  createCategoryStore,
  initCategoryStore
} from '@admin/shared/store/category-store'

export const CategoryStoreContext =
  createContext<StoreApi<CategoryStore> | null>(null)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const CategoryStoreProvider = ({
  children
}: CounterStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CategoryStore>>()
  if (!storeRef.current) {
    storeRef.current = createCategoryStore(initCategoryStore())
  }

  return (
    <CategoryStoreContext.Provider value={storeRef.current}>
      {children}
    </CategoryStoreContext.Provider>
  )
}

export const useCategoryStore = <T,>(
  selector: (store: CategoryStore) => T
): T => {
  const categoryStoreContext = useContext(CategoryStoreContext)

  if (!categoryStoreContext) {
    throw new Error(`useCategoryStore must be use within CategoryStoreProvider`)
  }

  return useStore(categoryStoreContext, selector)
}
