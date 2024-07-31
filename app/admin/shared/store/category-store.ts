import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import Fuse from 'fuse.js'
import { persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'
import { AlertData } from '../types'

type Category = Schema['Category']['type']

type PaginationToken = 'null' | string

export type CategoryState = {
  loading: {
    fetch?: boolean
    create?: boolean
    update?: boolean
    delete?: boolean
  }
  alerts: AlertData[]
  mapCategories: Record<PaginationToken, Category[]>
  formCategory: Category
  pagination: Pagination
  categorySelected: Category | null
  filters: FilterCategories
  filterCategories: Category[]
  categoriesSelected: Category['id'][]
}

export type FilterCategories = {
  search?: string
  active?: boolean | null
}

type Pagination = {
  pageSizes: number
  tokens: Array<PaginationToken>
  currentPage: number
  totalPages: number
  currentToken?: PaginationToken
  nextToken?: string | null
  hasMorePages?: boolean
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
  setCategorySelected: (category: Category | null) => void
  setPageSizes: (pageSizes: number) => Promise<void>
  showAlert: (alert: AlertData) => void
  onSuccessUpdate: (id: Category['id'], category: Partial<Category>) => void
  onSuccessCreate: () => void
  setFilters: (filters: Partial<FilterCategories>) => void
  applyFilters: (props?: {
    fields?: (keyof FilterCategories | 'all')[]
  }) => Promise<void>
  setCategoriesSelected: (categories: Category['id'][]) => void
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
    mapCategories: {},
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
    categorySelected: null,
    filterCategories: [],
    filters: {
      search: ''
    },
    categoriesSelected: []
  }
}

export const defaultInitState: CategoryState = initCategoryStore()

const client = generateClient<Schema>()

export const createCategoryStore = (
  initState: CategoryState = defaultInitState
) => {
  return createStore<CategoryStore>()(
    persist(
      (set, get) => ({
        ...initState,
        fetch: async ({ action, pageSelection }) => {
          const store = get()
          const filters = store.filters

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
              limit: (() => {
                return store.pagination.pageSizes
              })(),
              filter: (() => {
                let fil = {}

                if (typeof filters?.active === 'boolean') {
                  fil = {
                    ...fil,
                    active: {
                      eq: filters.active
                    }
                  }
                }

                if (!Object.keys(fil).length) {
                  return undefined
                }

                return fil
              })()
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
            const hasMemory = Object.keys(store.mapCategories).length
            if (hasMemory) {
              return
            }

            const { data, newNextToken } = await fetchCategories()

            const currentToken = 'null'

            const tokens = [currentToken]

            if (newNextToken) {
              tokens.push(newNextToken)
            }

            set({
              mapCategories: {
                [currentToken]: data
              },
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
              mapCategories: {
                [tokenSelected]: data
              },
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

            set({
              pagination: {
                ...pag,
                hasMorePages: false
              }
            })

            /**
             * Esto se hace porque las pagina inician en 1
             */
            const tokenSelected = pag.tokens[numberPageSelection - 1] || 'null'

            const isLastPage = numberPageSelection === tokens.length

            if (isLastPage) {
              const { data: listData, newNextToken } =
                await fetchCategories(tokenSelected)

              if (newNextToken && !tokens.includes(newNextToken)) {
                tokens.push(newNextToken)
              }

              set({
                mapCategories: {
                  ...mapCategories,
                  [tokenSelected]: listData
                },
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

              if (newNextToken && !tokens.includes(newNextToken)) {
                tokens.push(newNextToken)
              }

              set({
                mapCategories: {
                  ...mapCategories,
                  [tokenSelected]: listData
                },
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
            const tokenSelected =
              pag.tokens[numberPageSelection - 1] || 'default'

            if (isLastPage) {
              const { data: listData, newNextToken } =
                await fetchCategories(tokenSelected)

              if (newNextToken && !tokens.includes(newNextToken)) {
                tokens.push(newNextToken)
              }

              set({
                mapCategories: {
                  ...mapCategories,
                  [tokenSelected]: listData
                },
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
          const list = mapCategories[currentToken]

          set({
            loading: { delete: false },
            mapCategories: {
              ...mapCategories,
              [currentToken]: list?.filter((item) => item.id !== data.id) || []
            },
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
        },
        onSuccessUpdate: (id: Category['id'], category: Partial<Category>) => {
          console.debug('[category-store] onSuccessUpdate', id, category)
          const store = get()
          set({ categorySelected: null })

          /**
           * Filtrar la categoría en la lista local
           * 1. Buscar el item en la lista mapCategories
           * 2. Actualizar el item
           */
          const mapCategories = store.mapCategories

          const currentToken = store.pagination.currentToken || 'null'
          const list = mapCategories[currentToken]

          if (!list) {
            return
          }

          const index = list.findIndex((item) => item.id === id)

          if (index === -1) {
            return
          }

          list[index] = {
            ...list[index],
            ...category
          }

          set({
            mapCategories: {
              ...mapCategories,
              [currentToken]: list
            }
          })

          store.applyFilters()

          store.showAlert({
            type: 'success',
            message: 'La categoría fue actualizada correctamente'
          })
        },
        onSuccessCreate: async () => {
          const store = get()
          set({ categorySelected: null })

          await store.fetch({ action: 'refresh' })

          store.applyFilters()

          store.showAlert({
            type: 'success',
            message: 'La categoría fue creada correctamente'
          })
        },
        setFilters: (filters) => {
          const store = get()
          set({
            filters: {
              ...store.filters,
              ...filters
            }
          })
        },
        applyFilters: async (props) => {
          console.debug('[category-store] applyFilters')

          const storeInit = get()

          if (props?.fields?.includes('search')) {
            const search = storeInit.filters.search || ''
            let filterCategories: Category[] = []

            if (search) {
              let concatList: Category[] = []

              Object.values(storeInit.mapCategories).forEach((value) => {
                concatList = [...concatList, ...value]
              })

              const fuse = new Fuse(concatList, {
                keys: ['name', 'description']
              })

              const listFilter = fuse.search(search)

              filterCategories = listFilter.map((item) => item.item)
            }

            set({
              filterCategories
            })

            return
          }

          if (
            typeof storeInit?.filters?.active === 'boolean' ||
            storeInit?.filters?.active === null
          ) {
            await storeInit.fetch({
              action: 'refresh'
            })
          }
        },
        setCategoriesSelected: (categories) => {
          set({ categoriesSelected: categories })
        }
      }),
      {
        name: 'category-store'
      }
    )
  )
}
