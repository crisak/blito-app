'use client'

import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { Flex, Pagination, SelectField } from '@aws-amplify/ui-react'
import { useShallow } from 'zustand/react/shallow'

export default function PaginationCategories() {
  const store = useCategoryStore(
    useShallow((state) => ({
      fetch: state.fetch,
      pagination: state.pagination,
      setPagination: state.setPagination
    }))
  )

  const handleSelectRowsPerPage = (value: string) => {
    store.setPagination({
      pageSizes: Number(value)
    })
  }

  return (
    <Flex justifyContent="flex-end" gap="xl" marginBottom="large">
      <Flex gap="small" alignItems="center">
        Registros por pagina
        <SelectField
          labelHidden
          label="Filas por pagina"
          width="80px"
          size="small"
          value={store.pagination.pageSizes.toString()}
          onChange={(e) => handleSelectRowsPerPage(e.target.value)}
          options={['10', '20', '30', '40', '50', '100', '200', '300']}
        />
      </Flex>

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
    </Flex>
  )
}
