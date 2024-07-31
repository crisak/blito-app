import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'

const useModal = () => {
  const [open, onOpenChange] = React.useState(false)
  const close = () => onOpenChange(false)
  const show = () => onOpenChange(true)
  return { open, onOpenChange, close, show }
}

const Modal = ({ children, trigger, ...props }: any) => {
  const { open, onOpenChange } = props

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        console.debug('[Modal] open:', open)
        onOpenChange(open)
      }}
    >
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="backdrop-filter backdrop-blur-sm bg-black/10 bg-opacity-50 fixed inset-0 z-50" />
        <Dialog.Content className="bg-[#18181b] rounded-lg p-8 w-4/12 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Dialog.Close asChild className="absolute top-4 right-4">
            <button className="text-white/50 rounded-full w-8 h-8 flex items-center justify-center bg-transparent hover:bg-white/10 transition-colors duration-200 *:hover:bg-white/10 hover:text-white">
              &#10005;
            </button>
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const ModalContent = ({ children }: any) => <>{children}</>

const ModalHeader = ({ children, title }: any) => (
  <header>
    {title && (
      <Dialog.Title className="text-2xl font-bold">{title}</Dialog.Title>
    )}

    {Boolean(children) && children}
  </header>
)

const ModalBody = ({ children }: any) => <main>{children}</main>

const ModalFooter = ({ children }: any) => <footer>{children}</footer>

export { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useModal }
