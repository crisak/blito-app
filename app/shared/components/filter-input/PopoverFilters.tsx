'use client'

import { ThemeProviderCustom } from '@/app/admin/components'
import { Button, Flex, Text, ToggleButton, View } from '@aws-amplify/ui-react'
import { IconFilterList } from '@icons'
import * as Popover from '@radix-ui/react-popover'
import * as React from 'react'
import FieldFilter from './FieldFilter'

export type IdFieldFilter = string

export type FiltersProps = {
  label: string
  name: IdFieldFilter
  type: 'boolean' | 'radio' | 'select' | 'checkbox'
  options: { id: string | boolean; label: string }[]
  defaultValue?: string
}

export function PopoverFilters(props: {
  filters: FiltersProps[]
  type: 'radio'
  label?: string
  values?: string[]
  onSave?: (
    values: Record<
      IdFieldFilter,
      {
        type: 'boolean' | 'radio' | 'select'
        values: string[] | boolean | string
      }
    >
  ) => void
  options?: { id: string; label: string }[]
  onCanceled?: () => void
  onRemoveFilter?: () => void
}) {
  const [isPressed, setIsPressed] = React.useState(false)
  const [values, setValues] = React.useState<string[]>([])

  const printLabel = () => {
    if (values.length > 0) {
      if (props.type === 'radio') {
        const option = (props.options || []).find(
          (option) => option.id === values[0]
        )

        return option ? option.label : ''
      }
    }

    return props.label || ''
  }

  React.useEffect(() => {
    if (props.values) {
      setValues(props.values)
    }
  }, [props.values])

  return (
    <Popover.Root
      onOpenChange={(open) => {
        setIsPressed(open)
      }}
    >
      <Popover.Trigger asChild>
        <ToggleButton
          maxWidth={162}
          height={41}
          isPressed={isPressed}
          onChange={() => setIsPressed(!isPressed)}
          display="flex"
          gap="small"
          border={
            values.length ? '1px solid var(--amplify-colors-primary-60)' : ''
          }
        >
          <IconFilterList />

          {printLabel()}
        </ToggleButton>
      </Popover.Trigger>
      <Popover.Portal>
        <ThemeProviderCustom>
          <Popover.Content
            sideOffset={5}
            side="bottom"
            align="start"
            className="[Popover.Content] w-96 max-h-[700px] p-5 flex flex-col gap-5 rounded backdrop-blur-lg will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
            style={{
              boxShadow:
                '0 10px 38px -10px var(--amplify-colors-shadow-primary), 0 10px 20px -15px var(--amplify-colors-shadow-secondary)',
              backgroundColor: 'var(--amplify-colors-overlay-5)',
              border: '1px solid var(--amplify-colors-border-tertiary)',
              color: 'var(--amplify-colors-font-primary)',
              position: 'relative'
            }}
          >
            <Popover.Arrow
              style={{
                fill: 'var(--amplify-colors-border-tertiary)',
                stroke: 'var(--amplify-colors-border-tertiary)',
                strokeWidth: 1
              }}
            />

            <View as="header" className="text-lg font-bold">
              <Flex justifyContent="space-between">
                <Text as="h4">Filtros</Text>
                <Flex gap="small">
                  <Popover.Close aria-label="Close" asChild>
                    <Button
                      size="small"
                      variation="link"
                      colorTheme="overlay"
                      disabled={values.length === 0}
                      onClick={() => {
                        if (props.onCanceled) {
                          setValues([])
                          props.onCanceled()
                        }
                      }}
                    >
                      Eliminar filtros
                    </Button>
                  </Popover.Close>
                  <Popover.Close aria-label="Close" asChild>
                    <Button
                      size="small"
                      disabled={values.length === 0}
                      variation="link"
                      onClick={() => {
                        if (props.onSave) {
                          props.onSave({})
                        }
                      }}
                    >
                      Aplicar
                    </Button>
                  </Popover.Close>
                </Flex>
              </Flex>
            </View>

            <View as="main">
              <Flex direction="column" gap="medium">
                {props.filters.map((filter) => (
                  <div key={filter.name}>
                    <FieldFilter {...filter} />
                  </div>
                ))}
              </Flex>
            </View>

            {/* <View as="footer" className="flex justify-end gap-5">
              
            </View> */}
            {/* </View> */}
          </Popover.Content>
        </ThemeProviderCustom>
      </Popover.Portal>
    </Popover.Root>
  )
}
