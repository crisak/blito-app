'use client'

import { View } from '@aws-amplify/ui-react'
import { PopoverFilters } from '@shared/components'
import { useCategoryStore } from '@shared/providers'
import type { FilterCategories } from '@shared/store'
import clsx from 'clsx'
import { useShallow } from 'zustand/react/shallow'

type FilterCategoriesProps = React.ComponentPropsWithoutRef<'div'>

export default function FilterCategories(props: FilterCategoriesProps) {
  const className = clsx('flex gap-4', props.className)

  const store = useCategoryStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
      applyFilters: state.applyFilters
    }))
  )

  return (
    <View {...props} as="div" className={className}>
      <PopoverFilters
        filters={[
          {
            label: 'Estado',
            name: 'active',
            type: 'boolean',
            options: [
              { id: true, label: 'Activo' },
              { id: false, label: 'Inactivo' }
            ],
            value: store.filters?.active ?? null
          }
        ]}
        label="Filtros"
        onSave={(values) => {
          const filtersApplied: FilterCategories = {}

          const hasFilterActive = values?.active

          if (typeof hasFilterActive === 'object') {
            filtersApplied.active = values?.active?.value as boolean
          }

          store.setFilters({
            active: hasFilterActive ? filtersApplied.active : null
          })

          store.applyFilters()
        }}
        onCanceled={() => {
          store.setFilters({
            active: null
          })

          store.applyFilters()
        }}
        onRemoveFilter={() => {
          console.log('FilterInput onRemoveFilter')
        }}
      />
    </View>
  )
}
