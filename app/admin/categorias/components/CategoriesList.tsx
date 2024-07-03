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
import React, { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

type Category = Schema['Category']['type']

type CategoriesListProps = {
  categories: Category[]
  nextToken?: string | null
  createForm?: React.ReactNode
  updateForm?: (id: string, onSuccess: () => void) => React.ReactNode
}

export default function CategoriesList(props: CategoriesListProps) {
  const [flowForm, setFlowForm] = React.useState<
    'UPDATED' | 'CREATED' | 'LIST'
  >()

  const store = useCategoryStore(
    useShallow((state) => ({
      fetch: state.fetch,
      setFormCategory: state.setFormCategory,
      delete: state.delete,
      loading: state.loading,
      mapCategories: state.mapCategories,
      pagination: state.pagination,
      formCategory: state.formCategory
    }))
  )

  const handlerEdit = (category: Category) => {
    return () => {
      store.setFormCategory(category)
      setFlowForm('UPDATED')
    }
  }

  const handlerRemove = (category: Category) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      await store.delete(category)
      setFlowForm('LIST')
    }
  }

  useEffect(() => {
    store.fetch({
      action: 'init'
    })
  }, [])

  const renderItems = () => {
    const currentIndexPage = store.pagination.currentPage
    const token = store.pagination.tokens[currentIndexPage]
    const categories = store.mapCategories.get(token) || []

    if (store.loading.fetch) {
      return (
        <TableRow>
          <TableCell colSpan={5} textAlign="center" height={100}>
            Obteniendo resultados...
          </TableCell>
        </TableRow>
      )
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

            {props?.updateForm && (
              <Button
                size="small"
                onClick={handlerEdit(category)}
                variation="primary"
              >
                Editar
              </Button>
            )}
          </Flex>
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <>
      {flowForm === 'CREATED' && props?.createForm && !store.formCategory?.id}

      {flowForm === 'UPDATED' &&
        props?.updateForm &&
        props?.updateForm(store.formCategory.id, () => {
          setFlowForm('LIST')

          store.fetch({
            action: 'refresh'
          })
        })}

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
