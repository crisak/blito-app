'use client'

import { useCategoryStore } from '@admin/shared/providers/CategoryStoreProvider'
import { Placeholder } from '@aws-amplify/ui-react'

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
