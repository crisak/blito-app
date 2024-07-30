'use client'

import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { Text } from '@aws-amplify/ui-react'
import { useShallow } from 'zustand/react/shallow'

export default function TitleList() {
  const store = useCategoryStore(
    useShallow((state) => ({
      mapCategories: state.mapCategories,
      filters: state.filters,
      filterCategories: state.filterCategories,
      categoriesSelected: state.categoriesSelected
    }))
  )

  let totalReturned = 0
  let totalCategoriesSelected = store?.categoriesSelected?.length ?? 0

  Object.values(store.mapCategories || {}).forEach((categories) => {
    if (categories?.length) {
      totalReturned += categories.length
    }
  })

  if (store.filters.search) {
    totalReturned = store.filterCategories.length
  }

  return (
    <Text as="h2" fontSize="1.5em">
      Artículos devueltos
      <Text as="span" color="font.disabled" marginLeft="small">
        ({totalReturned}
        {totalCategoriesSelected > 0 ? ` / ${totalCategoriesSelected}` : ''})
      </Text>
    </Text>
  )
}
