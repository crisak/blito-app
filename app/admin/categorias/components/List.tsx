'use client'

import type { Schema } from '@/amplify/data/resource'
import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { Badge, Button, Icon } from '@aws-amplify/ui-react'
import { useEffect, useMemo } from 'react'
import { AutoSizer, Column, Table } from 'react-virtualized'
import { useShallow } from 'zustand/react/shallow'

type Category = Schema['Category']['type']

const ROW_HEIGHT = 55

const IconTrash = () => (
  <Icon ariaLabel="" pathData="M3 3h18v2H3V3zm4 4h10v12H7V7zm2 2v8h6V9H9z" />
)

const IconPencil = () => (
  <Icon
    ariaLabel=""
    pathData="M15.5 2.5l1.5 1.5L6.5 16H5v-1.5L15.5 2.5zm-1.41 1.41L6.5 13.91 5.09 12.5 13.59 4H14.5v1.41z"
  />
)

export default function ListCategories() {
  const store = useCategoryStore(
    useShallow((state) => ({
      mapCategories: state.mapCategories,
      pagination: state.pagination,
      fetch: state.fetch,
      loading: state.loading,
      delete: state.delete,
      setCategorySelected: state.setCategorySelected,
      filterCategories: state.filterCategories,
      filters: state.filters
    }))
  )

  const list = useMemo(() => {
    const currentToken = store.pagination.currentToken

    if (store.filterCategories.length) {
      return store.filterCategories
    }

    return store.mapCategories.get(currentToken || 'null') || []
  }, [
    store.mapCategories,
    store.filterCategories,
    store.pagination.currentToken
  ])

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

  useEffect(() => {
    store.fetch({
      action: 'init'
    })
  }, [])

  return (
    <AutoSizer>
      {(opt) => {
        const widthCount = 50
        const widthTitle = 300
        const widthDate = 200
        const widthActive = 100
        const widthActions = 100

        const widthDescription =
          opt.width -
          widthCount -
          widthTitle -
          widthDate -
          widthActive -
          widthActions

        const marginBottom = 150
        let heightTable = Math.min(
          (store.pagination.pageSizes + 1) * ROW_HEIGHT,
          opt.height - marginBottom
        )

        if (store.filters.search) {
          /**
           * Generar un alto dinámico con los items filtrado, no sebe superar maximo de la ventana si es asi habilitar scroll virtual
           */
          heightTable = Math.min(
            (store.filterCategories.length + 1) * ROW_HEIGHT,
            opt.height - marginBottom
          )
        }

        return (
          <Table
            noRowsRenderer={() => (
              <div className="flex justify-center items-center h-full">
                Sin datos
              </div>
            )}
            noContentRenderer={() => (
              <div className="flex justify-center items-center h-full">
                Sin datos
              </div>
            )}
            className="bordered border-gray-600"
            width={opt.width}
            height={heightTable}
            rowHeight={ROW_HEIGHT}
            rowCount={list.length}
            headerHeight={ROW_HEIGHT}
            rowGetter={({ index }) => ({
              ...list[index],
              active: Boolean(list[index]?.active),
              count: (() => {
                if (store.filters.search) {
                  return index + 1
                }

                const positionIndexToken = store.pagination.tokens.indexOf(
                  store.pagination.currentToken || 'null'
                )
                const positionIndexPage =
                  store.pagination.pageSizes * positionIndexToken

                return positionIndexPage + index + 1
              })(),
              createdAt: new Date(list[index].createdAt).toLocaleString(),
              actions: ''
            })}
          >
            <Column dataKey="count" label="#" width={widthCount} />
            <Column dataKey="name" label="Titulo" width={widthTitle} />
            <Column
              dataKey="description"
              label="Descripción"
              width={widthDescription}
            />
            <Column dataKey="createdAt" label="Creado" width={widthDate} />
            <Column
              dataKey="active"
              label="Activo"
              width={widthActive}
              cellRenderer={(props) => {
                const { active } = props.rowData as Category
                const text = active ? 'Activo' : 'Inactivo'
                return (
                  <Badge variation={active ? 'success' : 'warning'}>
                    {text}
                  </Badge>
                )
              }}
            />
            <Column
              dataKey="actions"
              label=""
              width={widthActions}
              cellRenderer={(props) => {
                const { count, actions, ...category } =
                  props.rowData as Category & { count: number; actions: string }
                return (
                  <div className="flex justify-between gap-2">
                    <Button onClick={handlerUpdate(category)} size="small">
                      <IconPencil />
                    </Button>

                    <Button
                      onClick={handlerRemove(category)}
                      variation="warning"
                      size="small"
                    >
                      <IconTrash />
                    </Button>
                  </div>
                )
              }}
            />
          </Table>
        )
      }}
    </AutoSizer>
  )
}
