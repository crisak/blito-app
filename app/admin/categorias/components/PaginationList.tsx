'use client'

import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { Pagination } from '@aws-amplify/ui-react'
import { useShallow } from 'zustand/react/shallow'

export default function PaginationList() {
  const store = useCategoryStore(
    useShallow((state) => ({
      fetch: state.fetch,
      pagination: state.pagination
    }))
  )

  const handleNextPage = async () => {
    await store.fetch({
      action: 'nextPage'
    })
  }

  const handlePreviousPage = async () => {
    await store.fetch({
      action: 'prevPage'
    })
  }

  const handleOnChange = async (currentIndex: number) => {
    const fixCurrentIndex = currentIndex - 1

    await store.fetch({
      action: 'changePage'
      // page: fixCurrentIndex
    })
  }

  return (
    <Pagination
      currentPage={store.pagination.currentPage}
      totalPages={store.pagination.tokens.length}
      onNext={handleNextPage}
      onPrevious={handlePreviousPage}
      onChange={(pageIndex) => handleOnChange(pageIndex ?? 0)}
    />
  )
}
