'use client'

import { ThemeProviderCustom } from '@/app/admin/components'
import { Button, Flex, Text, ToggleButton, View } from '@aws-amplify/ui-react'
import { IconFilterList } from '@admin/shared/icons'
import * as Popover from '@radix-ui/react-popover'
import * as React from 'react'
import FieldFilter from './FieldFilter'
import { GlobalState, PopoverFiltersProp } from './FilterInputTypes'

export function PopoverFilters(props: {
  filters: PopoverFiltersProp[]
  label?: string
  onSave?: (values: GlobalState) => void
  onCanceled?: () => void
  onRemoveFilter?: () => void
}) {
  const [isPressed, setIsPressed] = React.useState(false)
  const globalState = React.useState<GlobalState>(() => {
    const buildState = props.filters.reduce((acc, filter) => {
      acc[filter.name] = {
        type: filter.type,
        value: filter.value
      }

      return acc
    }, {} as GlobalState)
    return buildState || {}
  })

  const printLabel = () => {
    const buildState = props.filters.reduce((acc, filter) => {
      acc[filter.name] = {
        type: filter.type,
        value: filter.value ?? null
      }

      return acc
    }, {} as GlobalState)

    const totalFilters = Object.values(buildState).filter(
      (filter) => filter.value !== null
    ).length

    if (totalFilters === 1) {
      return `${totalFilters} filtro aplicado`
    } else if (totalFilters > 1) {
      return `${totalFilters} filtros aplicados`
    }

    return props.label || ''
  }

  return (
    <Popover.Root
      onOpenChange={(open) => {
        setIsPressed(open)
      }}
    >
      <Popover.Trigger asChild>
        <ToggleButton
          maxWidth={205}
          height={41}
          isPressed={isPressed}
          onChange={() => setIsPressed(!isPressed)}
          display="flex"
          gap="small"
          border={(() => {
            const hasFilters = props?.filters?.some(
              (filter) => filter.value !== null
            )

            if (hasFilters) {
              return '1px solid var(--amplify-colors-primary-60)'
            }

            return undefined
          })()}
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
            className="[Popover.Content] w-96 rounded backdrop-blur-xl will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
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

            {/* Agregar sombra hacia abajo */}
            <View
              as="header"
              className="text-lg font-bold backdrop-blur-xl shadow-md"
            >
              <Flex justifyContent="space-between" padding="medium">
                <Text as="h4">Filtros</Text>
                <Flex gap="small">
                  <Popover.Close
                    aria-label="Cerrar"
                    asChild
                    tabIndex={2}
                    autoFocus={false}
                  >
                    <Button
                      size="small"
                      variation="link"
                      colorTheme="overlay"
                      disabled={(() => {
                        const localState = globalState[0]
                        if (!localState) {
                          return true
                        }

                        const allFiltersNull = Object.values(localState).every(
                          (filter) => {
                            return filter.value === null
                          }
                        )

                        return allFiltersNull
                      })()}
                      onClick={() => {
                        if (props.onCanceled) {
                          globalState[1]({})
                          props.onCanceled()
                        }
                      }}
                    >
                      Eliminar filtros
                    </Button>
                  </Popover.Close>
                  <Popover.Close
                    aria-label="Aplicar filtros"
                    asChild
                    tabIndex={1}
                    autoFocus={(() => {
                      const originalState = (() => {
                        const buildState = props.filters?.reduce(
                          (acc, filter) => {
                            acc[filter.name] = {
                              type: filter.type,
                              value: filter.value
                            }

                            return acc
                          },
                          {} as GlobalState
                        )
                        return buildState || {}
                      })()

                      const localState = globalState[0]

                      const result =
                        JSON.stringify(originalState) ===
                        JSON.stringify(localState)

                      return !result
                    })()}
                  >
                    <Button
                      size="small"
                      variation="link"
                      onClick={() => {
                        if (props.onSave) {
                          props.onSave(globalState[0] as GlobalState)
                        }
                      }}
                    >
                      Aplicar
                    </Button>
                  </Popover.Close>
                </Flex>
              </Flex>
            </View>

            <View
              as="main"
              padding="medium"
              overflow="auto"
              className="max-h-[700px]"
            >
              <Flex direction="column" gap="medium">
                {props.filters.map((filter) => (
                  <div key={filter.name}>
                    <FieldFilter {...filter} stateField={globalState} />
                  </div>
                ))}
              </Flex>
            </View>
          </Popover.Content>
        </ThemeProviderCustom>
      </Popover.Portal>
    </Popover.Root>
  )
}