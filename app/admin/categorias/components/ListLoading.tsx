'use client'

import { Placeholder } from '@aws-amplify/ui-react'
import { useCategoryStore } from '@shared/providers/CategoryStoreProvider'

const HEIGHT = 4

export default function ListLoading() {
  const storeLoading = useCategoryStore(
    (state) => state.loading?.fetch ?? false
  )
  if (storeLoading) {
    return <Placeholder height={HEIGHT} />
  }
  return <div style={{ height: HEIGHT }} />
}
