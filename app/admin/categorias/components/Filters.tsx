'use client'

import { FilterInput } from '@/app/shared/components'
import clsx from 'clsx'

type FilterCategoriesProps = React.ComponentPropsWithoutRef<'div'>

export default function FilterCategories(props: FilterCategoriesProps) {
  const className = clsx('', props.className)

  return (
    <div {...props} className={className}>
      <FilterInput />
    </div>
  )
}
