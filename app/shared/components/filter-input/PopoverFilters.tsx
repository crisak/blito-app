'use client'

import { ThemeProviderCustom } from '@/app/admin/components'
import {
  Button,
  Flex,
  Radio,
  RadioGroupField,
  ToggleButton,
  View
} from '@aws-amplify/ui-react'
import * as Popover from '@radix-ui/react-popover'
import * as React from 'react'
import { IconArrowDown, IconArrowUp, IconClose } from '../icons'
/**
 * Styles:
 * @import '@radix-ui/colors/black-alpha.css';
@import '@radix-ui/colors/mauve.css';
@import '@radix-ui/colors/violet.css';

button,
fieldset,
input {
  all: unset;
}

.PopoverContent {
  border-radius: 4px;
  padding: 20px;
  width: 260px;
  background-color: white;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}
.PopoverContent:focus {
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px,
    0 0 0 2px var(--violet-7);
}
.PopoverContent[data-state='open'][data-side='top'] {
  animation-name: slideDownAndFade;
}
.PopoverContent[data-state='open'][data-side='right'] {
  animation-name: slideLeftAndFade;
}
.PopoverContent[data-state='open'][data-side='bottom'] {
  animation-name: slideUpAndFade;
}
.PopoverContent[data-state='open'][data-side='left'] {
  animation-name: slideRightAndFade;
}

.PopoverArrow {
  fill: white;
}

.PopoverClose {
  font-family: inherit;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--violet-11);
  position: absolute;
  top: 5px;
  right: 5px;
}
.PopoverClose:hover {
  background-color: var(--violet-4);
}
.PopoverClose:focus {
  box-shadow: 0 0 0 2px var(--violet-7);
}

.IconButton {
  font-family: inherit;
  border-radius: 100%;
  height: 35px;
  width: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--violet-11);
  background-color: white;
  box-shadow: 0 2px 10px var(--black-a7);
}
.IconButton:hover {
  background-color: var(--violet-3);
}
.IconButton:focus {
  box-shadow: 0 0 0 2px black;
}

.Fieldset {
  display: flex;
  gap: 20px;
  align-items: center;
}

.Label {
  font-size: 13px;
  color: var(--violet-11);
  width: 75px;
}

.Input {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 13px;
  line-height: 1;
  color: var(--violet-11);
  box-shadow: 0 0 0 1px var(--violet-7);
  height: 25px;
}
.Input:focus {
  box-shadow: 0 0 0 2px var(--violet-8);
}

.Text {
  margin: 0;
  color: var(--mauve-12);
  font-size: 15px;
  line-height: 19px;
  font-weight: 500;
}

@keyframes slideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRightAndFade {
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeftAndFade {
  from {
    opacity: 0;
    transform: translateX(2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
 * 
 */

export default function PopoverFilters(props: {
  type: 'radio'
  label?: string
  values?: string[]
  onSave?: (event: string[]) => void
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
          gap="medium"
          border={
            values.length ? '1px solid var(--amplify-colors-primary-60)' : ''
          }
        >
          {printLabel()}

          <Flex gap="small" alignItems="center">
            {isPressed ? <IconArrowUp /> : <IconArrowDown />}
            <span
              className="flex justify-center items-center rounded-full p-1 bg-gray-50/10 h-6 w-6 hover:bg-red-600/10 focus:outline-none transition-all duration-500 active:bg-red-600/20"
              onClick={(e) => {
                e.stopPropagation()

                if (props.onRemoveFilter) {
                  props.onRemoveFilter()
                }
              }}
            >
              <IconClose />
            </span>
          </Flex>
        </ToggleButton>
      </Popover.Trigger>
      <Popover.Portal>
        <ThemeProviderCustom>
          <Popover.Content
            sideOffset={5}
            className="p-5 flex flex-col gap-5 rounded backdrop-blur-md  will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
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

            {props.label && (
              <View as="header" className="text-lg font-bold">
                {props.label}
              </View>
            )}
            <View as="main">
              {props.type === 'radio' && (
                <RadioGroupField
                  legend="Label filter"
                  legendHidden
                  name="language"
                  value={values[0] || ''}
                  onChange={(data) => {
                    const value = data.target.value
                    setValues([value])
                  }}
                >
                  {(props.options || []).map((option) => (
                    <Radio key={option.id + option.label} value={option.id}>
                      {option.label}
                    </Radio>
                  ))}
                </RadioGroupField>
              )}
            </View>

            <View as="footer" className="flex justify-end gap-5">
              <Popover.Close aria-label="Close" asChild>
                <Button
                  size="small"
                  variation="link"
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
                  variation="primary"
                  onClick={() => {
                    if (props.onSave) {
                      props.onSave(values)
                    }
                  }}
                >
                  Aplicar
                </Button>
              </Popover.Close>
            </View>
            {/* </View> */}
          </Popover.Content>
        </ThemeProviderCustom>
      </Popover.Portal>
    </Popover.Root>
  )
}
