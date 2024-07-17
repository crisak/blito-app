'use client'

import { FilterInput } from '@/app/shared/components'
import { SelectField, View } from '@aws-amplify/ui-react'
import clsx from 'clsx'

type FilterCategoriesProps = React.ComponentPropsWithoutRef<'div'>

export default function FilterCategories(props: FilterCategoriesProps) {
  const className = clsx('flex gap-4', props.className)

  return (
    <View {...props} as="div" className={className}>
      <FilterInput
        onSuccess={(event: any) => {
          console.log('FilterInput onSuccess', { event })
        }}
      />
      <SelectField
        width={200}
        label=""
        options={['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco']}
      />
    </View>
  )
}
