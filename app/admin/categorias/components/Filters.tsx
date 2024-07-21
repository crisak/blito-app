'use client'

import { View } from '@aws-amplify/ui-react'
import { IdFieldFilter, PopoverFilters } from '@shared/components'
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
            ]
          },
          {
            label: 'Nombre',
            name: 'fruit',
            type: 'radio',
            options: [
              { id: 'apple01', label: '🍏 Apple' },
              { id: 'banana', label: '🍌 Banana' },
              { id: 'pear1', label: '🍐 Pera' }
            ]
          },
          {
            type: 'checkbox',
            label: 'Materias',
            name: 'subject',
            options: [
              { id: 'math', label: 'Matemáticas' },
              { id: 'science', label: 'Ciencias' },
              { id: 'history', label: 'Historia' },
              { id: 'english', label: 'Inglés' },
              { id: 'spanish', label: 'Español' }
            ]
          }
        ]}
        label="Filtros"
        type="radio"
        options={[
          { id: 'true', label: 'Activo' },
          { id: 'false', label: 'Inactivo' }
        ]}
        values={
          typeof store.filters?.active === 'boolean'
            ? [String(store.filters.active)]
            : []
        }
        onSave={(
          values: Record<
            IdFieldFilter,
            {
              type: 'boolean' | 'radio' | 'select'
              values: string[] | boolean | string
            }
          >
        ) => {
          const filtersApplied: FilterCategories = {}

          const hasFilterActive = values?.active

          if (typeof hasFilterActive === 'object') {
            filtersApplied.active = values?.active?.values as boolean
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
