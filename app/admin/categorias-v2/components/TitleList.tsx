'use client'

import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { useShallow } from 'zustand/react/shallow'

export default function TitleList() {
  const store = useCategoryStore(
    useShallow((state) => ({
      mapCategories: state.mapCategories,
      filters: state.filters,
      filterCategories: state.filterCategories
    }))
  )

  let totalReturned = 0

  store.mapCategories.forEach((categories) => {
    if (categories.length) {
      totalReturned += categories.length
    }
  })

  if (store.filters.search) {
    totalReturned = store.filterCategories.length
  }

  return (
    <h2 className="text-2xl font-semibold">
      Artículos devueltos
      <span className="text-gray-600"> ({totalReturned})</span>
    </h2>
  )
}
