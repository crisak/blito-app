import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { AlertData } from '../types'

const formCategoryDefault: Schema['Category'] = {
  name: '',
  description: '',
  id: '',
  createdAt: '',
  updatedAt: ''
}

interface CategoriesState {
  loading: {
    fetch?: boolean
    create?: boolean
    update?: boolean
    delete?: boolean
  }
  alerts: AlertData[]
  nextTokenPagination: string | null
  categories: Array<Schema['Category']>

  formCategory: Schema['Category']
  setFormCategory: (category: Schema['Category']) => void

  fetch: (
    categories?: Schema['Category'][] | 'refresh',
    nextToken?: string | null
  ) => Promise<{ nextToken?: string | null }>
  create: (category: Partial<Schema['Category']>) => Promise<boolean>
  update: (category: Partial<Schema['Category']>) => Promise<boolean>
  delete: (category: Partial<Schema['Category']>) => Promise<boolean>
  clearAlerts: () => void
}

const client = generateClient<Schema>()

const useCategoriesStore = create<CategoriesState>()(
  devtools(
    persist(
      (set, get) => ({
        loading: {
          fetch: false,
          create: false,
          update: false,
          delete: false
        },
        nextTokenPagination: null,
        alerts: [],
        categories: [],
        formCategory: formCategoryDefault,
        fetch: async (categoriesInit, nextTokenInit) => {
          const store = get()
          let newNextToken = null

          const fetchCategories = async () => {
            set({ loading: { fetch: true } })

            const { data, errors, nextToken } =
              await client.models.Category.list({
                nextToken: store.nextTokenPagination || nextTokenInit || ''
              })

            newNextToken = nextToken

            if (errors?.length) {
              set({
                loading: { fetch: false },
                alerts: errors.map((error) => ({
                  type: 'error',
                  message: error.message,
                  data: error?.errorInfo ? JSON.stringify(error.errorInfo) : ''
                }))
              })
              return
            }

            set({
              loading: { fetch: false },
              nextTokenPagination: newNextToken || null,
              categories: data
            })
          }

          if (
            typeof categoriesInit === 'string' &&
            categoriesInit === 'refresh'
          ) {
            await fetchCategories()
          } else if (Array.isArray(categoriesInit) && categoriesInit.length) {
            if (!store.categories?.length) {
              set({ categories: categoriesInit })
            }
          }
          return { nextToken: newNextToken }
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

          set({
            loading: { create: false },
            categories: [...store.categories, data],
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

          const { data, errors } = await client.models.Category.update({
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

          set({
            loading: { update: false },
            categories: store.categories.map((item) =>
              item.id === data.id ? data : item
            ),
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

          set({
            loading: { delete: false },
            categories: store.categories.filter((item) => item.id !== data.id),
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
        }
      }),
      {
        name: 'categories-store',
        storage: createJSONStorage(() => localStorage) // (optional) by default, 'localStorage' is used
      }
    )
  )
)

export default useCategoriesStore
