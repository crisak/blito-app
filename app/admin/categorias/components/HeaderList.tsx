'use client'
import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { ACTIONS } from '@/app/shared/utils/constants'
import { Button, Flex, SearchField, Text } from '@aws-amplify/ui-react'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

type HeaderListProps = {
  pagination?: React.ReactNode
}

export default function HeaderList(props: HeaderListProps) {
  const store = useCategoryStore(
    useShallow((state) => ({
      fetch: state.fetch,
      setFormCategory: state.setFormCategory,
      formCategory: state.formCategory,
      loading: state.loading,
      pagination: state.pagination,
      mapCategories: state.mapCategories
    }))
  )

  const handleRefresh = () => {
    store.fetch({
      action: 'refresh'
    })
  }

  const handlerAddCategory = () => {
    const toggleId =
      store.formCategory.id === ACTIONS.CREATE ? '' : ACTIONS.CREATE
    store.setFormCategory({
      name: '',
      description: '',
      id: toggleId,
      createdAt: '',
      updatedAt: ''
    })
  }

  const handlerSearch = (value: string) => {
    console.log('search:', value)
  }

  const totalCategories = useMemo(() => {
    let total = 0

    store.mapCategories.forEach((value) => {
      total += value.ls.length
    })

    return total
  }, [store.pagination.currentPage, store.mapCategories.size, store.loading])

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        marginBottom="large"
      >
        <Text variation="primary" as="h3" fontSize="1.2rem">
          Registros devueltos{' '}
          <Text as="span" fontStyle="normal" style={{ opacity: 0.6 }}>
            ({totalCategories})
          </Text>
        </Text>
        <Flex justifyContent="end" alignItems="center">
          <Button onClick={handleRefresh} isLoading={store.loading.fetch}>
            Refrescar
          </Button>
          <Button onClick={handlerAddCategory}>Agregar</Button>
        </Flex>
      </Flex>
      <Flex
        marginBlock="large"
        justifyContent="space-between"
        alignItems="center"
      >
        <SearchField
          label="Search"
          placeholder="Buscar ..."
          onChange={(e) => {
            const { value } = e.target
            handlerSearch(value)
          }}
          onSubmit={(value) => {
            handlerSearch(value)
          }}
        />

        {Boolean(props.pagination) && props.pagination}
      </Flex>
    </>
  )
}
