'use client'

import type { Schema } from '@/amplify/data/resource'
import { ThemeProviderCustom } from '@/app/components'
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

type CategoriesListProps = {
  categories: Schema['Category'][]
  nextToken?: string | null
}

export default function CategoriesList(props: CategoriesListProps) {
  const store = useCategoryStore(
    useShallow((state) => ({
      fetch: state.fetch,
      setFormCategory: state.setFormCategory,
      delete: state.delete,
      loading: state.loading,
      mapCategories: state.mapCategories,
      pagination: state.pagination
    }))
  )

  const handlerEdit = (category: Schema['Category']) => {
    return () => {
      store.setFormCategory(category)
    }
  }

  const handlerRemove = (category: Schema['Category']) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      await store.delete(category)
    }
  }

  useEffect(() => {
    store.fetch({
      action: 'init',
      categories: props.categories,
      nextToken: props.nextToken
    })
  }, [])

  const renderItems = () => {
    const currentIndexPage = store.pagination.currentPage
    const token = store.pagination.tokens[currentIndexPage]
    const categories = store.mapCategories.get(token)?.ls || []

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
            <Button
              size="small"
              onClick={handlerEdit(category)}
              variation="primary"
            >
              Editar
            </Button>
          </Flex>
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <ThemeProviderCustom>
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
    </ThemeProviderCustom>
  )
}
