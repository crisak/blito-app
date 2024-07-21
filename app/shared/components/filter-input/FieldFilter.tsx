'use client'

import {
  Button,
  CheckboxField,
  Flex,
  Radio,
  RadioGroupField,
  SwitchField,
  Text
} from '@aws-amplify/ui-react'
import * as React from 'react'
import { GlobalState, PopoverFiltersProp } from './FilterInputTypes'

type FieldFilterProps = PopoverFiltersProp & {
  stateField: [GlobalState, React.Dispatch<React.SetStateAction<GlobalState>>]
}

export default function FieldFilter(props: FieldFilterProps) {
  const [globalState, setGlobalState] = props.stateField
  const FIELD_NAME = props.name
  const TYPE = props.type

  const currentValue = React.useMemo(() => {
    return globalState?.[FIELD_NAME]?.value ?? null
  }, [globalState?.[FIELD_NAME]?.value])

  const renderLabel = (countFilters = 0) => {
    return (
      <Text
        as="h5"
        color="var(--amplify-colors-font-disabled)"
        marginBottom="xs"
        className="!flex !items-center !gap-2 "
      >
        <span className="pb-[2px]">{props.label}</span>

        {countFilters > 0 && (
          <Button
            size="small"
            variation="link"
            className="!py-[0px] !px-[2px] !h-[24.1px]"
            onClick={() => {
              setGlobalState((prevState) => ({
                ...prevState,
                [FIELD_NAME]: {
                  type: TYPE,
                  value: null
                }
              }))
            }}
          >
            {/* ({countFilters}) <IconClose fontSize={22} fontWeight={100} /> */}
            ({countFilters}) Eliminar
          </Button>
        )}
      </Text>
    )
  }

  if (TYPE === 'radio') {
    const hasNotFilter = currentValue === null || currentValue === undefined
    const selectedValue = currentValue ?? null
    return (
      <>
        {renderLabel(
          hasNotFilter
            ? 0
            : props.options.findIndex((option) => option.id === selectedValue)
        )}

        <RadioGroupField
          legend="Label filter"
          legendHidden
          name={FIELD_NAME}
          size="large"
          value={hasNotFilter ? undefined : String(selectedValue)}
          onChange={(event) => {
            const value = event.target.value

            setGlobalState((prevState) => ({
              ...prevState,
              [FIELD_NAME]: {
                type: TYPE,
                value: value
              }
            }))
          }}
        >
          {(props.options || []).map((option) => (
            <Radio key={option.id + option.label} value={String(option.id)}>
              {option.label}
            </Radio>
          ))}
        </RadioGroupField>
      </>
    )
  }

  if (TYPE === 'boolean') {
    const hasNotFilter = currentValue === null || currentValue === undefined

    const isChecked = Boolean(currentValue)

    const labelUnchecked = props.options.find(
      (option) => option.id === false
    )?.label

    const labelChecked = props.options.find(
      (option) => option.id === true
    )?.label

    return (
      <>
        {renderLabel(hasNotFilter ? 0 : 1)}

        <SwitchField
          thumbColor={(() => {
            if (hasNotFilter) {
              /** Default color */
              return undefined
            }

            if (!isChecked) {
              return 'var(--amplify-components-badge-warning-color)'
            }
          })()}
          trackColor={(() => {
            if (hasNotFilter) {
              /** Default color */
              return undefined
            }

            if (!isChecked) {
              return 'var(--amplify-colors-background-warning)'
            }
          })()}
          size="large"
          labelPosition="end"
          name={FIELD_NAME}
          label={(() => {
            if (hasNotFilter) {
              return 'Activar'
            }

            return isChecked ? labelChecked : labelUnchecked
          })()}
          isChecked={isChecked}
          onChange={(event) => {
            const isChecked = event.target.checked
            console.log('[FieldFilter] isChecked', isChecked)

            setGlobalState((prevState) => ({
              ...prevState,
              [FIELD_NAME]: {
                type: TYPE,
                value: isChecked
              }
            }))
          }}
        />
      </>
    )
  }

  if (TYPE === 'checkbox') {
    const valuesSelected = (currentValue as string[]) ?? []
    const indexValueSelected = ((currentValue as string[]) ?? []).reduce(
      (acc, value) => {
        acc[value] = true
        return acc
      },
      {} as Record<string, boolean>
    )

    return (
      <>
        {renderLabel((valuesSelected as string[]).length ?? 0)}

        <Flex direction="column" gap="xs">
          {props.options.map((option) => (
            <CheckboxField
              size="large"
              key={option.id + option.label}
              name={String(option.id)}
              label={option.label}
              value={String(option.id)}
              checked={indexValueSelected[option.id as string] ?? false}
              onChange={(event) => {
                const value = event.target.value
                const isChecked = event.target?.checked ?? false

                const newValue = isChecked
                  ? [...valuesSelected, value]
                  : valuesSelected.filter((item) => item !== value)

                setGlobalState((prevState) => ({
                  ...prevState,
                  [FIELD_NAME]: {
                    type: TYPE,
                    value: newValue
                  }
                }))
              }}
            />
          ))}
        </Flex>
      </>
    )
  }
}
