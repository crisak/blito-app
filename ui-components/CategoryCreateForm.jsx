/* eslint-disable */
'use client'
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField
} from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/api'
import * as React from 'react'
import { createCategory } from './graphql/mutations'
import { fetchByPath, getOverrideProps, validateField } from './utils'
const client = generateClient()
export default function CategoryCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props
  const initialValues = {
    name: '',
    description: '',
    active: false
  }
  const [name, setName] = React.useState(initialValues.name)
  const [description, setDescription] = React.useState(
    initialValues.description
  )
  const [active, setActive] = React.useState(initialValues.active)
  const [errors, setErrors] = React.useState({})
  const resetStateValues = () => {
    setName(initialValues.name)
    setDescription(initialValues.description)
    setActive(initialValues.active)
    setErrors({})
  }
  const validations = {
    name: [{ type: 'Required' }],
    description: [],
    active: []
  }
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue
    let validationResponse = validateField(value, validations[fieldName])
    const customValidator = fetchByPath(onValidate, fieldName)
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse)
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }))
    return validationResponse
  }
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault()
        let modelFields = {
          name,
          description,
          active
        }
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              )
              return promises
            }
            promises.push(runValidationTasks(fieldName, modelFields[fieldName]))
            return promises
          }, [])
        )
        if (validationResponses.some((r) => r.hasError)) {
          return
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields)
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === 'string' && value === '') {
              modelFields[key] = null
            }
          })
          await client.graphql({
            query: createCategory.replaceAll('__typename', ''),
            variables: {
              input: {
                ...modelFields
              }
            }
          })
          if (onSuccess) {
            onSuccess(modelFields)
          }
          if (clearOnSuccess) {
            resetStateValues()
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join('\n')
            onError(modelFields, messages)
          }
        }
      }}
      {...getOverrideProps(overrides, 'CategoryCreateForm')}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target
          if (onChange) {
            const modelFields = {
              name: value,
              description,
              active
            }
            const result = onChange(modelFields)
            value = result?.name ?? value
          }
          if (errors.name?.hasError) {
            runValidationTasks('name', value)
          }
          setName(value)
        }}
        onBlur={() => runValidationTasks('name', name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, 'name')}
      ></TextField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target
          if (onChange) {
            const modelFields = {
              name,
              description: value,
              active
            }
            const result = onChange(modelFields)
            value = result?.description ?? value
          }
          if (errors.description?.hasError) {
            runValidationTasks('description', value)
          }
          setDescription(value)
        }}
        onBlur={() => runValidationTasks('description', description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, 'description')}
      ></TextField>
      <SwitchField
        label="Active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={active}
        onChange={(e) => {
          let value = e.target.checked
          if (onChange) {
            const modelFields = {
              name,
              description,
              active: value
            }
            const result = onChange(modelFields)
            value = result?.active ?? value
          }
          if (errors.active?.hasError) {
            runValidationTasks('active', value)
          }
          setActive(value)
        }}
        onBlur={() => runValidationTasks('active', active)}
        errorMessage={errors.active?.errorMessage}
        hasError={errors.active?.hasError}
        {...getOverrideProps(overrides, 'active')}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, 'CTAFlex')}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault()
            resetStateValues()
          }}
          {...getOverrideProps(overrides, 'ClearButton')}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, 'RightAlignCTASubFlex')}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, 'SubmitButton')}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  )
}
