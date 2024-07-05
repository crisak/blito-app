import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { createStore } from 'zustand/vanilla'
import { AlertData } from '../types'

type Category = Schema['Category']['type']

type PaginationToken = 'null' | string

type Pagination = {
  pageSizes: number
  tokens: Array<PaginationToken>
  currentPage: number
  totalPages: number
  currentToken?: PaginationToken
  nextToken?: string | null
  hasMorePages?: boolean
}
export type CategoryState = {
  loading: {
    fetch?: boolean
    create?: boolean
    update?: boolean
    delete?: boolean
  }
  alerts: AlertData[]
  mapCategories: Map<PaginationToken, Category[]>
  formCategory: Category
  pagination: Pagination
  categorySelected: Category | null
}

export type CategoryActions = {
  setFormCategory: (category: Category) => void

  fetch: (opt: {
    action:
      | 'init'
      | 'refresh'
      | 'nextPage'
      | 'prevPage'
      | 'changePage'
      | 'changePageSizes'
    pageSelection?: number
  }) => Promise<void>
  delete: (category: Partial<Category>) => Promise<boolean>
  clearAlerts: () => void
  setCategorySelected: (category: Category) => void
  setPageSizes: (pageSizes: number) => Promise<void>
  showAlert: (alert: AlertData) => void
}

export type CategoryStore = CategoryState & CategoryActions

const formCategoryDefault: Category = {
  name: '',
  description: '',
  id: '',
  createdAt: '',
  updatedAt: ''
}

export const initCategoryStore = (): CategoryState => {
  return {
    mapCategories: new Map<PaginationToken, Category[]>(),
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false
    },

    alerts: [],
    formCategory: formCategoryDefault,
    pagination: {
      pageSizes: 5,
      tokens: [],
      currentPage: 0,
      totalPages: 0
    },
    categorySelected: null
  }
}

export const defaultInitState: CategoryState = initCategoryStore()

const client = generateClient<Schema>()

export const createCategoryStore = (
  initState: CategoryState = defaultInitState
) => {
  return createStore<CategoryStore>()((set, get) => ({
    ...initState,
    fetch: async ({ action, pageSelection }) => {
      const store = get()

      const fetchCategories = async (nextTokenInput?: string | null) => {
        set({ loading: { fetch: true } })

        const {
          data,
          errors,
          nextToken: newNextToken
        } = await client.models.Category.list({
          nextToken:
            nextTokenInput === 'default' || nextTokenInput === 'null'
              ? null
              : nextTokenInput,
          limit: store.pagination.pageSizes
        })

        if (errors?.length) {
          set({
            loading: { fetch: false },
            alerts: errors.map((error) => ({
              type: 'error',
              message: error.message,
              data: error?.errorInfo ? JSON.stringify(error.errorInfo) : ''
            }))
          })
          return {
            data: [],
            newNextToken: null
          }
        }

        set({ loading: { fetch: false } })

        return {
          data,
          newNextToken
        }
      }

      if (action === 'init') {
        /**
         * Validar si tiene información en memoria si ya se ha consultado
         * la información, en caso contrario hacer la consulta
         */
        if (store.mapCategories.size) {
          return
        }

        const { data, newNextToken } = await fetchCategories()

        const mapCategories = new Map<PaginationToken, Category[]>()

        const currentToken = 'null'

        mapCategories.set(currentToken, data || [])

        const tokens = [currentToken]

        if (newNextToken) {
          tokens.push(newNextToken)
        }

        set({
          mapCategories: new Map(mapCategories),
          pagination: {
            ...store.pagination,
            tokens,
            currentPage: 1,
            totalPages: tokens.length,
            currentToken,
            nextToken: newNextToken,
            hasMorePages: Boolean(newNextToken)
          }
        })
      } else if (action === 'refresh') {
        /** Refrescar la información desde el inicio en la primera página */
        const tokenSelected = 'null'
        const { data, newNextToken } = await fetchCategories(tokenSelected)

        const tokens = [tokenSelected]

        if (newNextToken) {
          tokens.push(newNextToken)
        }

        set({
          mapCategories: new Map([[tokenSelected, data]]),
          pagination: {
            ...store.pagination,
            tokens,
            currentToken: tokenSelected,
            nextToken: newNextToken,
            hasMorePages: Boolean(newNextToken),
            currentPage: 1,
            totalPages: tokens.length
          }
        })
      } else if (action === 'nextPage') {
        const pag = store.pagination
        const tokens = pag.tokens || []
        const numberPageSelection = (pag.currentPage ?? 1) + 1
        const mapCategories = store.mapCategories

        /**
         * Esto se hace porque las pagina inician en 1
         */
        const tokenSelected = pag.tokens[numberPageSelection - 1] || 'null'

        const isLastPage = numberPageSelection === tokens.length

        if (isLastPage) {
          const { data: listData, newNextToken } =
            await fetchCategories(tokenSelected)

          mapCategories.set(tokenSelected, listData)

          if (newNextToken && !tokens.includes(newNextToken)) {
            tokens.push(newNextToken)
          }

          set({
            mapCategories: new Map(mapCategories),
            pagination: {
              ...pag,
              tokens,
              currentPage: numberPageSelection,
              totalPages: tokens.length,
              currentToken: tokenSelected,
              nextToken: newNextToken,
              hasMorePages: Boolean(newNextToken)
            }
          })

          return
        }

        /** Has pages in memory */
        set({
          pagination: {
            ...pag,
            currentPage: numberPageSelection,
            currentToken: tokenSelected,
            nextToken: tokens[numberPageSelection] || null,
            hasMorePages: true
          }
        })
      } else if (action === 'prevPage') {
        const pag = store.pagination
        const tokens = pag.tokens || []
        const numberPageSelection = (pag.currentPage ?? 1) - 1
        const mapCategories = store.mapCategories

        /**
         * Esto se hace porque las pagina inician en 1
         */
        const tokenSelected = pag.tokens[numberPageSelection - 1] || 'null'

        const isLastPage = numberPageSelection === tokens.length

        if (isLastPage) {
          const { data: listData, newNextToken } =
            await fetchCategories(tokenSelected)

          mapCategories.set(tokenSelected, listData)

          if (newNextToken && !tokens.includes(newNextToken)) {
            tokens.push(newNextToken)
          }

          set({
            mapCategories: new Map(mapCategories),
            pagination: {
              ...pag,
              tokens,
              currentPage: numberPageSelection,
              totalPages: tokens.length,
              currentToken: tokenSelected,
              nextToken: newNextToken,
              hasMorePages: Boolean(newNextToken)
            }
          })
          return
        }

        /** Has pages in memory */
        set({
          pagination: {
            ...pag,
            currentPage: numberPageSelection,
            currentToken: tokenSelected,
            nextToken: tokens[numberPageSelection] || null,
            hasMorePages: true
          }
        })
      } else if (action === 'changePage') {
        const pag = store.pagination
        const tokens = pag.tokens || []
        const mapCategories = store.mapCategories
        const numberPageSelection = pageSelection ?? 1

        /**
         * Validar si el pagina que seleccionó es la última
         */
        const isLastPage = pageSelection === pag.tokens.length

        /**
         * Esto se hace porque las pagina inician en 1
         */
        const tokenSelected = pag.tokens[numberPageSelection - 1] || 'default'

        if (isLastPage) {
          const { data: listData, newNextToken } =
            await fetchCategories(tokenSelected)

          mapCategories.set(tokenSelected, listData)

          if (newNextToken && !tokens.includes(newNextToken)) {
            tokens.push(newNextToken)
          }

          set({
            mapCategories: new Map(mapCategories),
            pagination: {
              ...pag,
              tokens,
              currentPage: numberPageSelection,
              totalPages: tokens.length,
              currentToken: tokenSelected,
              nextToken: newNextToken,
              hasMorePages: Boolean(newNextToken)
            }
          })

          return
        }

        /** Has pages in memory */
        set({
          pagination: {
            ...pag,
            currentPage: numberPageSelection,
            currentToken: tokenSelected,
            nextToken: tokens[numberPageSelection] || null,
            hasMorePages: true
          }
        })
      } else if (action === 'changePageSizes') {
        /**
         * TODO:
         * Reorganiza los registros existentes entre las diferentes paginas
         * según la cantidad de registros que se quieren mostrar, si la cantidad
         * de registros es menor a la cantidad de registros que se muestran por
         * defecto, se debe eliminar las paginas que no se van a mostrar
         * y si la cantidad de registros es mayor a la cantidad de registros
         * que se muestran por defecto, se debe agregar las paginas que se
         * necesiten, la lista tokens tambien se debe actualizar
         */
      }
    },
    delete: async (category) => {
      const store = get()
      set({ loading: { delete: true } })

      const { data, errors } = await client.models.Category.delete({
        id: category.id || ''
      })

      if (errors?.length) {
        set({
          loading: { delete: false },
          alerts: errors.map((error) => ({
            type: 'error',
            message: error.message,
            data: error?.errorInfo ? JSON.stringify(error.errorInfo) : ''
          }))
        })
        return false
      }

      if (!data) {
        return false
      }

      const mapCategories = store.mapCategories
      const currentToken = store.pagination.currentToken || 'null'
      const list = mapCategories.get(currentToken)

      mapCategories.set(
        currentToken,
        list?.filter((item) => item.id !== data.id) || []
      )

      set({
        loading: { delete: false },
        mapCategories: new Map(mapCategories),
        alerts: [
          {
            type: 'success',
            message: 'La categoría se ha eliminado correctamente',
            data: null
          }
        ]
      })
      return true
    },
    setFormCategory: (category) => {
      set({ formCategory: category })
    },
    clearAlerts: () => {
      set({ alerts: [] })
    },
    setCategorySelected: (category) => {
      set({ categorySelected: category })
    },
    setPageSizes: async (pageSizes) => {
      set({
        pagination: {
          ...get().pagination,
          pageSizes
        }
      })
      await get().fetch({ action: 'refresh' })
    },
    showAlert: (alert) => {
      set({ alerts: [...get().alerts, alert] })
    }
  }))
}
