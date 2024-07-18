'use client'

import { FilterInput, IconAdd } from '@/app/shared/components'
import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { Button, View } from '@aws-amplify/ui-react'
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
      <FilterInput
        label="Activo"
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
        onSave={(values) => {
          store.setFilters({
            active: values[0] === 'true'
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

      {/* Aplicar un border-radius del 50% al botón con tailwindcss */}
      <Button className="rounded-full">
        <IconAdd />
      </Button>
    </View>
  )
}
