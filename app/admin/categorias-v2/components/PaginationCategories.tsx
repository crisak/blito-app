'use cliente'

import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { Pagination } from '@aws-amplify/ui-react'
import { useShallow } from 'zustand/react/shallow'

type PaginationListProps = {}

export default function PaginationCategories(props: PaginationListProps) {
  const store = useCategoryStore(
    useShallow((state) => ({
      fetch: state.fetch,
      pagination: state.pagination
    }))
  )

  return (
    <Pagination
      currentPage={store.pagination.currentPage}
      totalPages={store.pagination.totalPages}
      hasMorePages={store.pagination.hasMorePages}
      onNext={() => {
        store.fetch({
          action: 'nextPage'
        })
      }}
      onPrevious={() => {
        store.fetch({
          action: 'prevPage'
        })
      }}
      onChange={(numberPageSelection) => {
        store.fetch({
          action: 'changePage',
          pageSelection: numberPageSelection
        })
      }}
    />
  )
}
