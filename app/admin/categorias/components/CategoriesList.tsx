'use client'

import type { Schema } from '@/amplify/data/resource'
import { ThemeProviderCustom } from '@/app/components'
import { useCategoriesStore } from '@/app/shared/store'
import { ACTIONS } from '@/app/shared/utils/constants'
import {
  Button,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text
} from '@aws-amplify/ui-react'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

type CategoriesListProps = {
  categories: Schema['Category'][]
  nextToken?: string | null
}

export default function CategoriesList(props: CategoriesListProps) {
  const store = useCategoriesStore(
    useShallow((state) => ({
      fetch: state.fetch,
      categories: state.categories,
      setFormCategory: state.setFormCategory,
      delete: state.delete,
      loading: state.loading,
      formCategory: state.formCategory
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

  const handleRefresh = () => {
    store.fetch('refresh')
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

  useEffect(() => {
    store.fetch(props.categories, props.nextToken)
  }, [])

  const renderItems = () => {
    if (store.loading.fetch) {
      return (
        <TableRow>
          <TableCell colSpan={5} textAlign="center" height={100}>
            Obteniendo resultados...
          </TableCell>
        </TableRow>
      )
    }

    if (store.categories.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} textAlign="center" height={100}>
            La consulta no arrojó ningún resultado
          </TableCell>
        </TableRow>
      )
    }

    return store.categories.map((category, index) => (
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
      <Flex
        alignItems="center"
        justifyContent="space-between"
        marginBottom="large"
      >
        <Text variation="primary" as="h3" fontSize="1.2rem">
          Registros devueltos{' '}
          <Text as="span" fontStyle="normal" style={{ opacity: 0.6 }}>
            ({store.categories.length})
          </Text>
        </Text>
        <Flex justifyContent="end" alignItems="center">
          <Button onClick={handleRefresh} isLoading={store.loading.fetch}>
            Refrescar
          </Button>
          <Button onClick={handlerAddCategory}>Agregar</Button>
        </Flex>
      </Flex>

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
