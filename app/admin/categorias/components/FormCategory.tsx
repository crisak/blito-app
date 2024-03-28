// components/TodoList.tsx
'use client'

import type { Schema } from '@/amplify/data/resource'
import { useCategoriesStore } from '@/app/shared/store'
import {
  Button,
  Fieldset,
  Flex,
  TextAreaField,
  TextField
} from '@aws-amplify/ui-react'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function FormCategory() {
  const store = useCategoriesStore(
    useShallow((state) => ({
      categories: state.categories,
      create: state.create,
      update: state.update,
      setFormCategory: state.setFormCategory,
      formCategory: state.formCategory,
      alerts: state.alerts,
      loading: state.loading
    }))
  )

  const [formData, setFormData] = useState<Schema['Category']>(() => {
    return {
      id: store.formCategory.id || '',
      name: store.formCategory.name || '',
      description: store.formCategory.description || '',
      createdAt: store.formCategory.createdAt || '',
      updatedAt: store.formCategory.updatedAt || ''
    }
  })

  const resetCurrentState = () => {
    setFormData({
      name: '',
      description: '',
      id: '',
      createdAt: '',
      updatedAt: ''
    })
  }

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.id === 'create') {
      createCategory()
      return
    }

    updateCategory()
  }

  const createCategory = async () => {
    const resultStatus = await store.create({
      name: formData.name,
      description: formData.description
    })

    if (resultStatus) {
      resetCurrentState()
    }
  }

  const updateCategory = async () => {
    const statusResult = await store.update(formData)

    if (statusResult) {
      resetCurrentState()
    }
  }

  const handlerCancel = () => {
    resetCurrentState()
    store.setFormCategory({
      id: '',
      name: '',
      description: '',
      createdAt: '',
      updatedAt: ''
    })
  }

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    if (store.formCategory?.id) {
      setFormData(store.formCategory)
    }
  }, [store.formCategory?.id])

  if (!store.formCategory?.id) {
    return null
  }

  const titleFieldset = store.formCategory.id === 'create' ? 'Crear' : 'Editar'

  return (
    <>
      <form onSubmit={handlerSubmit}>
        <Fieldset legend={`${titleFieldset} categoría`} size="large">
          <Flex direction="column" gap="xxl">
            <TextField
              label="Titulo"
              value={formData.name}
              name="name"
              onChange={handlerChange}
            />
            <TextAreaField
              label="Descripción"
              name="description"
              onChange={handlerChange as any}
              value={formData.description || ''}
            />
            <Flex justifyContent="flex-end">
              <Button
                type="button"
                variation="destructive"
                onClick={handlerCancel}
                isDisabled={store.loading.create || store.loading.update}
              >
                Canelar
              </Button>
              <Button
                type="submit"
                variation="primary"
                isLoading={store.loading.create || store.loading.update}
              >
                Guardar
              </Button>
            </Flex>
          </Flex>
        </Fieldset>
      </form>
    </>
  )
}
