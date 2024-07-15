'use client'

import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { SearchField } from '@aws-amplify/ui-react'
import { useShallow } from 'zustand/react/shallow'

export default function InputSearch() {
  const store = useCategoryStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      applyFilters: state.applyFilters
    }))
  )

  return (
    <SearchField
      label="Buscar"
      placeholder="Buscar ..."
      value={store.filters.search}
      onChange={(e) => {
        const value = e.target.value || ''

        store.setFilters({
          search: value
        })

        store.applyFilters()
      }}
      onClear={() => {
        store.setFilters({
          search: ''
        })

        store.applyFilters()
      }}
    />
  )
}