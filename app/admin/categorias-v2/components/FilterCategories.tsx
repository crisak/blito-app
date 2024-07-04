'use client'

import { Flex } from '@aws-amplify/ui-react'

type FilterCategoriesProps = {
  children?: React.ReactNode
}

export default function FilterCategories(props: FilterCategoriesProps) {
  return (
    <Flex justifyContent="flex-end" gap="small" marginBottom="large">
      {Boolean(props.children) && props.children}
    </Flex>
  )
}
