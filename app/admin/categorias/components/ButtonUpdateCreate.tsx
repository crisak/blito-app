'use client'

import CategoryCreateForm from '@/ui-components/CategoryCreateForm'
import CategoryUpdateForm from '@/ui-components/CategoryUpdateForm'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useModal
} from '@admin/shared/components/modal'
import { useCategoryStore } from '@admin/shared/providers/CategoryStoreProvider'
import { Button } from '@aws-amplify/ui-react'
import * as React from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function ButtonUpdateCreate() {
  const store = useCategoryStore(
    useShallow((state) => ({
      categorySelected: state.categorySelected,
      showAlert: state.showAlert,
      setCategorySelected: state.setCategorySelected,
      onSuccessCreate: state.onSuccessCreate,
      onSuccessUpdate: state.onSuccessUpdate
    }))
  )

  const modal = useModal()

  React.useEffect(() => {
    if (store.categorySelected?.id) {
      modal.show()
    }
  }, [store.categorySelected?.id])

  return (
    <Modal
      {...modal}
      trigger={
        <Button variation="primary" size="small">
          Crear
        </Button>
      }
    >
      <ModalContent>
        <ModalHeader title="Editar perfil" />

        <ModalBody>
          {!store?.categorySelected?.id && (
            <CategoryCreateForm
              onSuccess={() => {
                modal.close()
                store.onSuccessCreate()
              }}
            />
          )}

          {store?.categorySelected?.id && (
            <CategoryUpdateForm
              id={store.categorySelected.id}
              onSuccess={(dataUpdate) => {
                console.debug(
                  '[ButtonUpdateCreate] CategoryUpdateForm:',
                  dataUpdate
                )
                modal.close()
                store.onSuccessUpdate(
                  store.categorySelected?.id || '',
                  dataUpdate
                )
              }}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
