'use client'
import { useCategoriesStore } from '@/app/shared/store'
import { Pagination } from '@aws-amplify/ui-react'
import * as React from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function PaginationList() {
  const store = useCategoriesStore(
    useShallow((state) => ({
      fetch: state.fetch,
      nextTokenPagination: state.nextTokenPagination
    }))
  )

  const [pageTokens, setPageTokens] = React.useState<string[]>([
    store.nextTokenPagination || ''
  ])
  const [currentPageIndex, setCurrentPageIndex] = React.useState<number>(1)
  const [hasMorePages, setHasMorePages] = React.useState(
    Boolean(store.nextTokenPagination)
  )

  const handleNextPage = async () => {
    if (hasMorePages && currentPageIndex === pageTokens.length) {
      const { nextToken } = await store.fetch()

      if (!nextToken) {
        setHasMorePages(false)
      }

      setPageTokens([...pageTokens, nextToken || ''])
    }

    setCurrentPageIndex(currentPageIndex + 1)
  }

  return (
    <Pagination
      currentPage={currentPageIndex}
      totalPages={pageTokens.length}
      hasMorePages={hasMorePages}
      onNext={handleNextPage}
      onPrevious={() => setCurrentPageIndex(currentPageIndex - 1)}
      onChange={(pageIndex) => setCurrentPageIndex(pageIndex ?? 1)}
    />
  )
}
