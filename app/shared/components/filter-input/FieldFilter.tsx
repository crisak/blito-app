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
import { IconClose } from '@icons'

type FilterProps = {
  label: string
  name: string
  type: 'boolean' | 'radio' | 'select' | 'checkbox'
  options: { id: string | boolean; label: string }[]
  defaultValue?: string | boolean | string[]
}

export default function FieldFilter(props: FilterProps) {
  const renderLabel = () => {
    return (
      <Text
        as="h5"
        color="var(--amplify-colors-font-disabled)"
        marginBottom="xs"
        flex="auto"
        className="!flex !items-center"
      >
        {props.label}
        <Button
          size="small"
          variation="link"
          marginLeft="xxs"
          className="!py-[2px] !px-[2px]"
        >
          (1) <IconClose />
        </Button>
      </Text>
    )
  }

  if (props.type === 'radio') {
    return (
      <>
        {renderLabel()}

        <RadioGroupField
          legend="Label filter"
          legendHidden
          name="language"
          size="large"
          // value={values[0] || ''}
          // onChange={(data) => {
          //   const value = data.target.value
          //   setValues([value])
          // }}
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

  if (props.type === 'boolean') {
    const defaultValue = Boolean(props.defaultValue)

    const labelUnchecked = props.options.find(
      (option) => option.id === false
    )?.label
    const labelChecked = props.options.find(
      (option) => option.id === true
    )?.label

    return (
      <>
        {renderLabel()}

        <SwitchField
          size="large"
          name={props.name}
          isDisabled={defaultValue}
          label={defaultValue ? labelChecked : labelUnchecked}
          labelPosition="end"
        />
      </>
    )
  }

  if (props.type === 'checkbox') {
    return (
      <>
        {renderLabel()}

        <Flex direction="column" gap="xs">
          {props.options.map((option) => (
            <CheckboxField
              size="large"
              key={option.id + option.label}
              name={props.name}
              label={option.label}
              value={String(option.id)}
            />
          ))}
        </Flex>
      </>
    )
  }
}
