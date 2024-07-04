'use client'

import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { CategoryCreateForm, CategoryUpdateForm } from '@/ui-components'
import { Button } from '@aws-amplify/ui-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as React from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function ButtonUpdateCreate() {
  const store = useCategoryStore(
    useShallow((state) => ({
      mapCategories: state.mapCategories,
      pagination: state.pagination,
      fetch: state.fetch,
      loading: state.loading,
      delete: state.delete,
      categorySelected: state.categorySelected
    }))
  )

  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (store.categorySelected?.id) {
      setOpen(true)
    }
  }, [store.categorySelected?.id])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variation="primary" size="small" width="xxxl">
          Crear
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        {/* Estilos para con tailwind para una modal */}
        <Dialog.Overlay className="backdrop-filter backdrop-blur-sm bg-black/10 bg-opacity-50 fixed inset-0 z-50" />

        {/* Estilos para el contenido de la modal */}
        <Dialog.Content className="bg-[#18181b] rounded-lg p-8 w-4/12 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Dialog.Close asChild className="absolute top-4 right-4">
            {/* <button className="IconButton" aria-label="Close"> */}
            <button className="text-white/50 rounded-full w-8 h-8 flex items-center justify-center bg-transparent hover:bg-white/10 transition-colors duration-200 *:hover:bg-white/10 hover:text-white">
              {/* Icon close */}
              &#10005;
            </button>
          </Dialog.Close>
          <Dialog.Title className="text-2xl font-bold">
            Edit profile
          </Dialog.Title>
          <Dialog.Description className="text-gray-400 mt-2">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>

          {!store?.categorySelected?.id && (
            <CategoryCreateForm
              onSuccess={() => {
                setOpen(false)
                store.fetch({
                  action: 'refresh'
                })
              }}
            />
          )}

          {store?.categorySelected?.id && (
            <CategoryUpdateForm
              id={store.categorySelected.id}
              onSuccess={() => {
                setOpen(false)
                store.fetch({
                  action: 'refresh'
                })
              }}
            />
          )}

          <footer className="flex justify-end mt-8 gap-4">
            <Dialog.Close asChild>
              <button className="bg-[#2f2f2f] px-4 py-2 rounded-lg text-white text-center">
                Cancelar
              </button>
            </Dialog.Close>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
