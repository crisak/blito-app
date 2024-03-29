import { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { createStore } from 'zustand/vanilla'
import { AlertData } from '../types'

type Category = Schema['Category']

type PaginationToken = 'default' | string

export type CategoryState = {
  loading: {
    fetch?: boolean
    create?: boolean
    update?: boolean
    delete?: boolean
  }
  alerts: AlertData[]
  mapCategories: Map<PaginationToken, { index: number; ls: Category[] }>
  formCategory: Category
  pagination: {
    tokens: Array<PaginationToken>
    currentPage: number
    totalPages: number
  }
}

export type CategoryActions = {
  setFormCategory: (category: Category) => void

  fetch: (opt: {
    action: 'init' | 'refresh' | 'nextPage' | 'prevPage' | 'changePage'
    categories?: Category[]
    nextToken?: string | null
    page?: number
  }) => Promise<{ nextToken?: string | null }>
  create: (category: Partial<Category>) => Promise<boolean>
  update: (category: Partial<Category>) => Promise<boolean>
  delete: (category: Partial<Category>) => Promise<boolean>
  clearAlerts: () => void
  setPagination: (pagination: {
    tokens?: Array<PaginationToken>
    currentPage?: number
    totalPages?: number
  }) => void
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
    mapCategories: new Map<
      PaginationToken,
      { index: number; ls: Category[] }
    >(),
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false
    },

    alerts: [],
    formCategory: formCategoryDefault,
    pagination: {
      tokens: [],
      currentPage: 0,
      totalPages: 0
    }
  }
}

export const defaultInitState: CategoryState = {
  mapCategories: new Map<PaginationToken, { index: number; ls: Category[] }>(),
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false
  },
  alerts: [],

  formCategory: formCategoryDefault,
  pagination: {
    tokens: [],
    currentPage: 0,
    totalPages: 0
  }
}

const client = generateClient<Schema>()

export const createCategoryStore = (
  initState: CategoryState = defaultInitState
) => {
  return createStore<CategoryStore>()((set, get) => ({
    ...initState,
    fetch: async ({ action, categories, nextToken, page }) => {
      const store = get()

      const fetchCategories = async (nextTokenInput?: string | null) => {
        set({ loading: { fetch: true } })

        const {
          data,
          errors,
          nextToken: newNextToken
        } = await client.models.Category.list({
          nextToken: nextTokenInput === 'default' ? null : nextTokenInput
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

      const hasInitCategories = Boolean(categories?.length)
      const hasStoredCategories = Boolean(store?.mapCategories?.size)

      if (action === 'init' && !hasStoredCategories && hasInitCategories) {
        const mapCategories = new Map<
          PaginationToken,
          { index: number; ls: Category[] }
        >()
        mapCategories.set('default', { index: 0, ls: categories || [] })

        const tokens = ['default']

        if (nextToken) {
          tokens.push(nextToken)
        }

        set({
          mapCategories,
          pagination: {
            tokens,
            currentPage: 0,
            totalPages: 1
          }
        })
      } else if (action === 'refresh') {
        const mapCategories = store.mapCategories
        const currentToken =
          store.pagination.tokens[store.pagination.currentPage]
        const { data } = await fetchCategories(currentToken)
        mapCategories.set(currentToken, { index: 0, ls: data || [] })
        return { nextToken: null }
      } else if (action === 'nextPage') {
        const mapCategories = store.mapCategories

        const nextPageIndex = store.pagination.currentPage + 1
        const nextPageToken = store.pagination.tokens[nextPageIndex] || ''
        const nextCategories = mapCategories.get(nextPageToken)

        const hasNextCategories = Boolean(nextCategories?.ls?.length)

        if (!hasNextCategories) {
          const { newNextToken, data } = await fetchCategories(nextPageToken)

          const tokens = store.pagination.tokens || []

          if (newNextToken && !tokens.includes(newNextToken)) {
            tokens.push(newNextToken)
          }

          mapCategories.set(nextPageToken, {
            index: tokens.length - 1,
            ls: data || []
          })

          set({
            mapCategories,
            pagination: {
              ...store.pagination,
              tokens,
              currentPage: nextPageIndex,
              totalPages: tokens.length
            }
          })

          return { nextToken: newNextToken }
        } else {
          set({
            pagination: {
              ...store.pagination,
              currentPage: nextPageIndex
            }
          })
        }
      } else if (action === 'prevPage') {
        const mapCategories = store.mapCategories

        const prevPageIndex = store.pagination.currentPage - 1
        const prevPageToken = store.pagination.tokens[prevPageIndex] || ''
        const prevCategories = mapCategories.get(prevPageToken)

        const hasPrevCategories = Boolean(prevCategories?.ls?.length)

        if (hasPrevCategories) {
          set({
            pagination: {
              ...store.pagination,
              currentPage: prevPageIndex
            }
          })
        }
      } else if (action === 'changePage') {
        const mapCategories = store.mapCategories

        const currentPageIndex = page || 0
        const currentPageToken = store.pagination.tokens[currentPageIndex] || ''
        const currentCategories = mapCategories.get(currentPageToken)

        console.log({
          action,
          categories,
          nextToken,
          page,
          currentPageIndex,
          currentPageToken,
          currentCategories
        })

        const hasCurrentCategories = Boolean(currentCategories?.ls?.length)

        if (!hasCurrentCategories) {
          const { newNextToken, data } = await fetchCategories(currentPageToken)

          const tokens = store.pagination.tokens || []

          if (newNextToken && !tokens.includes(newNextToken)) {
            tokens.push(newNextToken)
          }

          mapCategories.set(currentPageToken, {
            index: tokens.length - 1,
            ls: data || []
          })

          set({
            mapCategories,
            pagination: {
              ...store.pagination,
              tokens,
              currentPage: currentPageIndex,
              totalPages: tokens.length
            }
          })

          return { nextToken: newNextToken }
        } else {
          set({
            pagination: {
              ...store.pagination,
              currentPage: currentPageIndex
            }
          })
        }
      }

      return { nextToken: null }
    },
    create: async (category) => {
      const store = get()
      set({ loading: { create: true } })

      const { data, errors } = await client.models.Category.create({
        name: category.name || '',
        description: category.description || ''
      })

      if (errors?.length) {
        set({
          loading: { create: false },
          alerts: errors.map((error) => ({
            type: 'error',
            message: error.message,
            data: error?.errorInfo ? JSON.stringify(error.errorInfo) : ''
          }))
        })
        return false
      }

      const mapCategories = store.mapCategories
      const lastToken =
        store.pagination.tokens[store.pagination.tokens.length - 1]
      const list = mapCategories.get(lastToken)?.ls || []

      mapCategories.set(lastToken, {
        index: mapCategories.get(lastToken)?.index || 0,
        ls: [...list, data]
      })

      set({
        loading: { create: false },
        mapCategories,
        formCategory: formCategoryDefault,
        alerts: [
          {
            type: 'success',
            message: 'La categoría se ha creado correctamente',
            data: ''
          }
        ]
      })

      return true
    },
    update: async (category) => {
      const store = get()
      set({ loading: { update: true } })

      const { errors } = await client.models.Category.update({
        id: category.id || '',
        description: category.description || '',
        name: category.name || ''
      })

      if (errors?.length) {
        set({
          loading: { update: false },
          alerts: errors.map((error) => ({
            type: 'error',
            message: error.message,
            data: error?.errorInfo ? JSON.stringify(error.errorInfo) : ''
          }))
        })
        return false
      }

      const mapCategories = store.mapCategories

      const newDataUpdate: { token: string; ls: Category[] } = {
        token: '',
        ls: []
      }
      mapCategories.forEach((value, key) => {
        const findCategoryById = value.ls.find(
          (item) => item.id === category.id
        )
        if (findCategoryById) {
          newDataUpdate.token = key
          newDataUpdate.ls =
            value.ls.filter((item) => item.id !== category.id) || []
        }
      })

      mapCategories.set(newDataUpdate.token, {
        index: mapCategories.get(newDataUpdate.token)?.index || 0,
        ls: newDataUpdate.ls
      })

      set({
        loading: { update: false },
        mapCategories,
        formCategory: formCategoryDefault,
        alerts: [
          {
            type: 'success',
            message: 'La categoría se ha actualizado correctamente',
            data: ''
          }
        ]
      })
      return true
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

      const mapCategories = store.mapCategories
      const currentToken =
        store.pagination.tokens[store.pagination.currentPage] || 'default'
      const list = mapCategories.get(currentToken)

      mapCategories.set(currentToken, {
        index: list?.index || 0,
        ls: list?.ls?.filter((item) => item.id !== data.id) || []
      })

      set({
        loading: { delete: false },
        mapCategories,
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
    setPagination: (pagination) => {
      set({
        pagination: {
          ...get().pagination,
          ...pagination
        }
      })
    }
  }))
}
