'use client'

import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { Flex, Pagination, SelectField } from '@aws-amplify/ui-react'
import { useShallow } from 'zustand/react/shallow'

export default function PaginationCategories() {
  const store = useCategoryStore(
    useShallow((state) => ({
      loading: state.loading,
      fetch: state.fetch,
      pagination: state.pagination,
      setPageSizes: state.setPageSizes,
      filters: state.filters
    }))
  )

  const handleSelectRowsPerPage = (value: string) => {
    store.setPageSizes(Number(value))
  }

  const options = {
    currentPage: (() => {
      if (store.filters.search) {
        return 1
      }

      return store.pagination.currentPage
    })(),
    totalPages: (() => {
      if (store.filters.search) {
        return 1
      }

      return store.pagination.totalPages
    })(),
    hasMorePages: (() => {
      if (store.filters.search) {
        return false
      }

      return store.pagination.hasMorePages
    })()
  }

  return (
    <Flex justifyContent="flex-end" gap="xl">
      {!store?.filters?.search && (
        <>
          <Flex gap="small" alignItems="center">
            Registros por pagina
            <SelectField
              labelHidden
              label="Filas por pagina"
              width="80px"
              size="small"
              isDisabled={Boolean(store?.loading?.fetch)}
              value={store.pagination.pageSizes.toString()}
              onChange={(e) => handleSelectRowsPerPage(e.target.value)}
              options={['5', '10', '20', '30', '40', '50', '100', '200', '300']}
            />
          </Flex>

          <Pagination
            {...options}
            onNext={() => {
              if (store.loading.fetch) {
                return
              }

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
        </>
      )}
    </Flex>
  )
}
