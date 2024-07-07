'use client'

import clsx from 'clsx'

type FilterCategoriesProps = React.ComponentPropsWithoutRef<'div'>

export default function FilterCategories(props: FilterCategoriesProps) {
  const className = clsx('flex', props.className)

  return (
    <div {...props} className={className}>
      {Boolean(props.children) && props.children}
    </div>
  )
}
