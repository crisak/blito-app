'use client'

import type { Schema } from '@/amplify/data/resource'
import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import {
  Button,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@aws-amplify/ui-react'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import LoadingRow from './LoadingRow'

type Category = Schema['Category']['type']

export default function ListCategories() {
  const store = useCategoryStore(
    useShallow((state) => ({
      mapCategories: state.mapCategories,
      pagination: state.pagination,
      fetch: state.fetch,
      loading: state.loading,
      delete: state.delete,
      setCategorySelected: state.setCategorySelected
    }))
  )

  const handlerRemove = (category: Category) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      await store.delete(category)
    }
  }

  const handlerUpdate = (category: Category) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      await store.setCategorySelected(category)
    }
  }

  const renderItems = () => {
    const currentToken = store.pagination.currentToken
    const categories = store.mapCategories.get(currentToken || 'null') || []

    if (store.loading.fetch) {
      return <LoadingRow rows={store.pagination.pageSizes} columns={5} />
    }

    if (categories.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} textAlign="center" height={100}>
            La consulta no arrojó ningún resultado
          </TableCell>
        </TableRow>
      )
    }

    return categories.map((category, index) => (
      <TableRow key={category.id}>
        <TableCell width={8}>{index + 1}</TableCell>
        <TableCell>{category.name}</TableCell>
        <TableCell>{category.description}</TableCell>
        <TableCell>{new Date(category.updatedAt).toLocaleString()}</TableCell>
        <TableCell width={90}>
          <Flex justifyContent="space-between">
            <Button
              size="small"
              onClick={handlerRemove(category)}
              variation="warning"
            >
              Eliminar
            </Button>

            {/* {props?.updateForm && ( */}
            <Button
              size="small"
              onClick={handlerUpdate(category)}
              variation="primary"
            >
              Editar
            </Button>
            {/* )} */}
          </Flex>
        </TableCell>
      </TableRow>
    ))
  }

  useEffect(() => {
    store.fetch({
      action: 'init'
    })
  }, [])

  return (
    <>
      <Table highlightOnHover={false} color="lightgray">
        <TableHead>
          <TableRow>
            <TableCell as="th" width={8}>
              #
            </TableCell>
            <TableCell as="th">Nombre</TableCell>
            <TableCell as="th">Descripción</TableCell>
            <TableCell as="th">Ultima modificación</TableCell>
            <TableCell as="th"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderItems()}</TableBody>
      </Table>
    </>
  )
}
